# Agents / Architecture Notes

This service implements a **stateless OAuth-style authorization proxy** between PocketBase, AWS Cognito, and ICPC APIs. Its purpose is narrowly scoped: authenticate users via Cognito, authorize them via ICPC participation data, and issue PocketBase-compatible tokens.

The service is intentionally _not_ a general OAuth provider. It is a security boundary whose sole responsibility is to decide whether a Cognito-authenticated user is allowed to access a given PocketBase-backed quest.

---

## System participants

- **PocketBase** – OAuth client and application backend. Calls `/` to initiate login and `/token/:contestIds` to exchange codes for tokens.
- **AWS Cognito** – Identity provider (authentication only). Issues authorization codes and ID tokens.
- **ICPC APIs** – Authorization source. Determines whether a user is staff or team member in a contest.
- **Quest frontends** – Hosted under `*.${QUESTS_DOMAIN}`. These are considered trusted infrastructure but never receive redeemable Cognito credentials.

---

## What this service does

- Validates OAuth redirects and derives `questName` from the redirect URI
- Cryptographically binds OAuth state to a specific quest
- Prevents Cognito authorization codes from reaching PocketBase or frontends in plaintext
- Performs ICPC authorization checks at token exchange time
- Issues PocketBase-compatible ID tokens only after authorization succeeds
- Remains fully stateless

---

## What this service explicitly does not do

- Store sessions or user state
- Cache authorization decisions
- Act as a generic OAuth / OIDC provider
- Grant access based on anything other than ICPC data

---

## Request flow (detailed)

### 1. OAuth initiation (`GET /`)

PocketBase initiates the OAuth flow and sends:

- `redirect_uri`
- `state` (opaque PocketBase value)

Expected redirect URI format:

```
https://<quest>.${QUESTS_DOMAIN}/api/oauth2-redirect
```

The service validates:

- HTTPS scheme
- Exact path match (`/api/oauth2-redirect`)
- Host suffix matches `${QUESTS_DOMAIN}`
- Quest name matches `[a-z0-9_-]+`

If validation fails, the request is rejected.

---

### 2. Signed OAuth state

Instead of forwarding raw JSON, the service creates a signed state object:

```
{
  questName,
  pocketbaseState
}
```

This object is signed using HMAC (HS256).

**Purpose**:

- Prevent attacker-controlled JSON from being accepted later
- Bind the OAuth flow to a specific quest
- Avoid server-side storage

---

### 3. Cognito authentication

The user is redirected to Cognito Hosted UI. After authentication, Cognito redirects back to:

```
GET /loggedin?code=...&state=...
```

The service verifies the HMAC signature on `state` before using it.

---

### 4. Authorization code wrapping

The Cognito authorization `code` is **never forwarded directly**.

Instead, the service encrypts it using:

- JWE Compact serialization
- `alg = dir`
- `enc = A256GCM`

This produces a URL-safe, authenticated ciphertext.

**Why this matters**:

- PocketBase never sees a Cognito-redeemable code
- Frontend JavaScript cannot exchange the code with Cognito
- Accidental logging downstream does not leak credentials

---

### 5. Redirect back to quest frontend

The user is redirected to:

```
https://<quest>.${QUESTS_DOMAIN}/api/oauth2-redirect
```

With query parameters:

- `code` – wrapped Cognito code
- `state` – original PocketBase state

From PocketBase’s perspective, this behaves like a standard OAuth provider.

---

### 6. Token exchange (`POST /token/:contestIds`)

PocketBase calls this endpoint server-to-server with:

- `client_id`
- `client_secret`
- wrapped `code`
- contest IDs provided in the URL path

The service:

- Decrypts the wrapped code
- Exchanges it with Cognito for tokens
- Uses the Cognito **ID token** as bearer when calling ICPC APIs (upstream requirement)

---

### 7. Authorization via ICPC

For each contest ID:

- ICPC participation API is queried
- Authorization succeeds if the user is:
  - a team member, or
  - a staff member

Authorization succeeds if **any** contest matches.

ICPC is treated as the sole source of truth.

---

### 8. Token issuance for PocketBase

If authorized:

- A new ID token is issued
- Signed using the PocketBase `client_secret`
- `iss` is set to this service (`https://${AUTH_DOMAIN}`)
- Access and refresh tokens are dummy values

---

## Stateless design

The service stores **no server-side state**.

Replay protection relies on:

- Cognito’s authorization code lifecycle
- HTTPS
- Encrypted code wrapping (prevents reuse outside this service)

---

## Cryptography summary

| Purpose               | Mechanism         |
| --------------------- | ----------------- |
| OAuth state integrity | JWT (HS256)       |
| Code confidentiality  | JWE (AES-256-GCM) |
| Token issuance        | JWT (HS256)       |

All cryptography uses standard primitives and well-reviewed libraries.

---

## Trust boundaries

Trusted:

- AWS Cognito
- PocketBase server
- ICPC APIs
- Infrastructure under `*.${QUESTS_DOMAIN}`

Untrusted:

- Browsers
- Frontend JavaScript
- Network outside TLS guarantees

---

## Security invariants

The following must always hold:

- A user cannot log into PocketBase without ICPC authorization
- Cognito authorization codes never reach PocketBase in plaintext
- Frontends cannot exchange Cognito codes
- The service can be restarted at any time without loss of security

---

## Summary

This service is a deliberately small, explicit authorization boundary. All complexity exists to compensate for external constraints (Cognito Hosted UI, ICPC API behavior) while keeping the system stateless, auditable, and robust.
