import axios from "axios";
import crypto from "crypto";
import express from "express";
import { CompactEncrypt, compactDecrypt } from "jose";
import jwt from "jsonwebtoken";
import { Buffer } from "node:buffer";
import process from "node:process";
import querystring from "node:querystring";

const app = express();
const PORT = 3000;

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const COGNITO_DOMAIN = requireEnv("COGNITO_DOMAIN");
const COGNITO_CLIENT_ID = requireEnv("COGNITO_CLIENT_ID");
const AUTH_DOMAIN = requireEnv("AUTH_DOMAIN");
const QUESTS_DOMAIN = requireEnv("QUESTS_DOMAIN");

const STATE_SECRET = requireBase64Env("STATE_SECRET", 32);
const WRAP_KEY = requireBase64Env("WRAP_KEY", 32);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function requireBase64Env(name, expectedBytes) {
  const buf = Buffer.from(requireEnv(name), "base64");
  if (buf.length !== expectedBytes) {
    throw new Error(
      `Env var ${name} must decode to exactly ${expectedBytes} bytes (got ${buf.length})`,
    );
  }
  return buf;
}

const PATH_PB_REDIRECT = "/api/oauth2-redirect";
const AUTH_CALLBACK = `https://${AUTH_DOMAIN}/loggedin`;

const bearer = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const issueIdToken = ({ aud, sub, email, name, signingKey, emailVerified }) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: `https://${AUTH_DOMAIN}`,
    sub,
    aud,
    name,
    email,
    email_verified: !!emailVerified,
    exp: now + 3600, // 1 hour expiration
    iat: now,
  };
  return jwt.sign(payload, signingKey, {
    algorithm: "HS256",
    header: { typ: "JWT", alg: "HS256" },
  });
};

const exchangeCodeForTokens = async (code) => {
  let tokenUrl = new URL("/oauth2/token", `https://${COGNITO_DOMAIN}`);
  const tokenResponse = await axios.post(
    tokenUrl.toString(),
    querystring.stringify({
      grant_type: "authorization_code",
      client_id: COGNITO_CLIENT_ID,
      code,
      redirect_uri: AUTH_CALLBACK,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return tokenResponse.data;
};

const getIcpcPerson = async (accessToken) => {
  const url = new URL("/api/person/info/basic", "https://icpc.global");
  const response = await axios.get(url.toString(), bearer(accessToken));
  return response.data;
};

const getIcpcParticipation = async (contestId, accessToken) => {
  const url = new URL(
    `/api/contest/participant/participation/contest/${contestId}`,
    "https://icpc.global",
  );
  const response = await axios.get(url.toString(), bearer(accessToken));
  return response.data;
};

function validateQuestName(questName) {
  // Require a simple quest name: letters, digits, dash, underscore only
  return /^[a-z0-9_-]+$/.test(questName);
}

function parseAndValidateRedirectUri(redirectUri) {
  try {
    const u = new URL(redirectUri);
    if (u.protocol !== "https:") return null;
    if (u.pathname !== PATH_PB_REDIRECT) return null;

    const domain = String(QUESTS_DOMAIN || "").toLowerCase();
    const host = u.hostname.toLowerCase();
    const suffix = `.${domain}`;
    if (!domain || !host.endsWith(suffix)) return null;

    const before = host.slice(0, -suffix.length);
    if (!before) return null;
    if (!validateQuestName(before)) return null;

    return { questName: before };
  } catch {
    return null;
  }
}

/**
 * Signed state: prevents attacker-controlled JSON being accepted in /loggedin.
 */
function signState({ pocketbaseState, questName }) {
  return jwt.sign({ pocketbaseState, questName }, STATE_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m",
    issuer: `https://${AUTH_DOMAIN}`,
  });
}

function verifyState(state) {
  return jwt.verify(state, STATE_SECRET, {
    algorithms: ["HS256"],
    issuer: `https://${AUTH_DOMAIN}`,
  });
}

/**
 * Wrap Cognito code so PocketBase never receives a redeemable Cognito code.
 * JWE compact is URL-safe and authenticated.
 */
async function wrapCognitoCode(code) {
  const plaintext = Buffer.from(JSON.stringify({ code }), "utf8");
  return await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(WRAP_KEY);
}

async function unwrapCognitoCode(wrapped) {
  const { plaintext } = await compactDecrypt(wrapped, WRAP_KEY);
  const obj = JSON.parse(Buffer.from(plaintext).toString("utf8"));
  if (!obj || typeof obj.code !== "string") throw new Error("bad wrapped code");
  return obj.code;
}

app.get("/", (req, res) => {
  try {
    const { state: pocketbaseState, redirect_uri } = req.query;

    if (!pocketbaseState || !redirect_uri) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const parsed = parseAndValidateRedirectUri(String(redirect_uri));
    if (!parsed) {
      return res.status(400).json({ error: "Invalid redirect_uri" });
    }

    const { questName } = parsed;

    const state = signState({ pocketbaseState, questName });

    const loginUrl = new URL("/login", `https://${COGNITO_DOMAIN}`);
    loginUrl.searchParams.set("client_id", COGNITO_CLIENT_ID);
    loginUrl.searchParams.set("response_type", "code");
    loginUrl.searchParams.set("scope", "email openid");
    loginUrl.searchParams.set("redirect_uri", AUTH_CALLBACK);
    loginUrl.searchParams.set("state", state);

    res.redirect(loginUrl.toString());
  } catch (error) {
    console.error("Error in /", error?.message || error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/loggedin", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    let decoded;
    try {
      decoded = verifyState(String(state));
    } catch {
      return res.status(400).json({ error: "Invalid state" });
    }

    const { questName, pocketbaseState } = decoded;

    if (!validateQuestName(questName)) {
      return res
        .status(400)
        .json({ error: `Invalid quest name: ${questName}` });
    }

    const wrappedCode = await wrapCognitoCode(String(code));

    const questHost = `${questName}.${QUESTS_DOMAIN}`;
    const questRedirectUrl = new URL(PATH_PB_REDIRECT, `https://${questHost}`);
    questRedirectUrl.searchParams.set("code", wrappedCode);
    questRedirectUrl.searchParams.set("state", pocketbaseState);

    res.redirect(questRedirectUrl.toString());
  } catch (error) {
    console.error("Error in /loggedin", error?.message || error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.post("/token/:contestId", async (req, res) => {
  try {
    const contestIds = req.params.contestId.split(",");

    if (!contestIds.length || contestIds.length > 20) {
      return res.status(400).json({ error: "Invalid contestIds" });
    }
    if (contestIds.some((id) => !/^\d+$/.test(id))) {
      return res.status(400).json({ error: "Invalid contestId format" });
    }

    const { client_id, client_secret, code } = req.body;

    if (!client_id || !client_secret || !code) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const cognitoCode = await unwrapCognitoCode(String(code));

    const tokens = await exchangeCodeForTokens(cognitoCode);
    if (!tokens?.id_token) {
      return res.status(400).json({ error: "Upstream exchange failed" });
    }

    const claims = jwt.decode(tokens.id_token) || {};
    const sub = claims.sub;
    const email = claims.email;
    const emailVerified = claims.email_verified;

    const { firstName, lastName } = await getIcpcPerson(tokens.id_token);
    let allowed = false;

    for (const contestId of contestIds) {
      const part = await getIcpcParticipation(contestId, tokens.id_token);
      console.log("Participation lookup", {
        contestId,
        email,
        firstName,
        lastName,
        part,
      });

      if (part?.teamMember || part?.staffMember) {
        allowed = true;
        break;
      }
    }

    if (!allowed) {
      return res.status(403).json({ error: "forbidden" });
    }

    const newIdToken = issueIdToken({
      aud: client_id,
      sub,
      email,
      name: `${firstName} ${lastName}`,
      emailVerified,
      signingKey: client_secret,
    });

    const dummyToken = crypto.randomBytes(32).toString("hex");
    res.json({
      access_token: dummyToken,
      refresh_token: dummyToken,
      id_token: newIdToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: "openid email profile",
    });
  } catch (error) {
    console.error("Error in /token/:contestId", error?.message || error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`OAuth Provider listening on port ${PORT}`));
