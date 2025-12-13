import axios from "axios";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";
import process from "node:process";
import querystring from "node:querystring";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const QUESTS_DOMAIN = process.env.QUESTS_DOMAIN;

const PATH_PB_REDIRECT = "/api/oauth2-redirect";
const AUTH_CALLBACK = `https://${AUTH_DOMAIN}/loggedin`;

const bearer = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const issueIdToken = ({ aud, sub, email, name, signingKey }) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: `https://${COGNITO_DOMAIN}`,
    sub,
    aud,
    name,
    email,
    email_verified: true,
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

app.get("/", (req, res) => {
  try {
    const { state: pocketbaseState, redirect_uri } = req.query;

    if (!pocketbaseState || !redirect_uri) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const { questName } = parseAndValidateRedirectUri(String(redirect_uri));

    const state = JSON.stringify({ pocketbaseState, questName });

    const loginUrl = new URL("/login", `https://${COGNITO_DOMAIN}`);
    loginUrl.searchParams.set("client_id", COGNITO_CLIENT_ID);
    loginUrl.searchParams.set("response_type", "code");
    loginUrl.searchParams.set("scope", "email openid");
    loginUrl.searchParams.set("redirect_uri", AUTH_CALLBACK);
    loginUrl.searchParams.set("state", state);

    res.redirect(loginUrl.toString());
  } catch (error) {
    console.error("Error in /", error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/loggedin", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const { questName, pocketbaseState } = JSON.parse(state);

    if (!validateQuestName(questName)) {
      return res
        .status(400)
        .json({ error: `Invalid quest name: ${questName}` });
    }

    const questHost = `${questName}.${QUESTS_DOMAIN}`;
    const questRedirectUrl = new URL(PATH_PB_REDIRECT, `https://${questHost}`);
    questRedirectUrl.searchParams.set("code", code);
    questRedirectUrl.searchParams.set("state", pocketbaseState);

    res.redirect(questRedirectUrl.toString());
  } catch (error) {
    console.error("Error in /loggedin", error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.post("/token/:contestId", async (req, res) => {
  try {
    const { client_id, client_secret, code } = req.body;
    const contestIds = req.params.contestId.split(",");

    if (!client_id || !client_secret || !code || contestIds.length === 0) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const tokens = await exchangeCodeForTokens(code);
    const { sub, email } = jwt.decode(tokens.id_token);
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

      if (part.teamMember || part.staffMember) {
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
    console.error("Error in /token/:contestId", error);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`OAuth Provider listening on port ${PORT}`));
