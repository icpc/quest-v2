import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import process from "node:process";
import querystring from "querystring";

const app = express();
const PORT = 3000;

// Load from environment
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Parse form data and query params
app.use(bodyParser.urlencoded({ extended: false }));

// 1. Redirect users to Cognito login, passing contestId as state
//    Usage: GET /?contestId=1234
app.get("/", (req, res) => {
  const contestId = req.query.contestId;
  if (!contestId) {
    return res.status(400).send("Missing contestId parameter");
  }

  const loginUrl =
    `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}` +
    `&response_type=code&scope=email+openid+phone` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${encodeURIComponent(contestId)}`;

  console.log("Redirecting to login:", loginUrl);
  res.redirect(loginUrl);
});

// 2. Callback endpoint matching your REDIRECT_URI (e.g. /loggedin)
//    Retrieves code and state (contestId), then fetches participations
app.get("/loggedin", async (req, res) => {
  const { code, state: contestId } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code missing");
  }
  if (!contestId) {
    return res.status(400).send("Missing state parameter (contestId)");
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      `https://${COGNITO_DOMAIN}/oauth2/token`,
      querystring.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const accessToken = tokenResponse.data.id_token;

    // Fetch participations for the given contestId
    const apiResponse = await axios.get(
      `https://icpc.global/api/person/info/participations/${contestId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    console.log("Participations API response data:", apiResponse.data);
    // Display JSON in browser
    res.json(apiResponse.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
    return res
      .status(err.response?.status || 500)
      .send(`Error: ${err.response?.data?.error_description || err.message}`);
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
