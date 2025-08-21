ICPC Quest Auth (Fake OpenID for PocketBase)

What It Is

- OAuth2/OpenID shim for Quest’s PocketBase instances.
- Logs in users via ICPC Cognito, verifies they are team/staff of a contest, and returns a minimal HS256 ID Token to PocketBase.
- Minimal data exposure: only essential claims; the ID Token is signed with the PocketBase `client_secret`.

Endpoints

- `GET /` — Start login
- `GET /loggedin` — Cognito callback
- `POST /token/:contestId` — Token exchange and authorization
- `GET /health` — Liveness.

Required Env Vars

- `COGNITO_DOMAIN`
- `COGNITO_CLIENT_ID`
- `AUTH_DOMAIN`
- `QUESTS_DOMAIN`

Run

- Install: `pnpm install`
- Start: `npm start`
- Listens on `http://localhost:3000`

PocketBase Config (Minimal)

- Auth URL: `https://${AUTH_DOMAIN}/`
- Token URL: `https://${AUTH_DOMAIN}/token/<contestId>`
- Client id/secret can be anything
