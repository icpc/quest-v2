ICPC Quest Auth (Fake OpenID for PocketBase)

## What It Is

- OAuth2/OpenID shim for Quest’s PocketBase instances.
- Logs in users via ICPC Cognito, verifies they are team/staff of a contest, and returns a minimal HS256 ID Token to PocketBase.
- Minimal data exposure: only essential claims; the ID Token is signed with the PocketBase `client_secret`.

### Endpoints

- `GET /` — Start login
- `GET /loggedin` — Cognito callback
- `POST /token/:contestId` — Token exchange and authorization (supports comma-separated contest IDs)
- `GET /health` — Liveness.

### PocketBase Config (Minimal)

- Auth URL: `https://${AUTH_DOMAIN}/`
- Token URL: `https://${AUTH_DOMAIN}/token/<contestId>`
- Multiple contest IDs can be allowed by comma-separating them (e.g. `token/abc123,def456`).
- Client id/secret can be anything

## Security model

This service is a **stateless authorization proxy** that integrates PocketBase, AWS Cognito, and ICPC APIs. It does not function as a general OAuth provider; its role is to make a single security decision: whether a Cognito-authenticated user is allowed to access PocketBase based on ICPC participation.

## Threat model

### Assumed attackers

- External users attempting to authenticate without ICPC authorization
- Malicious or compromised frontend JavaScript
- Accidental credential leakage via logs or redirects
- External users calling public endpoints (including `/token`) with arbitrary inputs
- Compromise or manipulation of PocketBase `client_id` and `client_secret`

### Out of scope

- Full compromise of AWS Cognito user accounts
- Compromise of ICPC infrastructure or authorization logic

Out-of-scope items are treated as trusted roots; the proxy cannot defend against their total failure.

## Key security properties

### 1. Least-privilege token issuance

Tokens issued by this service:

- Are essentially dummies
- Are scoped to PocketBase
- Cannot be used to access Cognito or ICPC APIs
- Are valid only for a limited time

Returned `access_token` and `refresh_token` values are dummy placeholders and carry no authority. The issued `id_token` is meaningful only to PocketBase and cannot be used against Cognito or ICPC APIs.

Only the authorization proxy ever handles Cognito or ICPC bearer credentials. Even if PocketBase or a quest frontend is compromised, these credentials cannot be recovered or reused to perform actions on `icpc.global`.

Compromise of PocketBase client credentials is considered in scope. Such a compromise may allow misuse of the `/token` endpoint as a public exchange endpoint, but it does not allow bypassing ICPC authorization checks or impersonating users outside of ICPC-authorized contexts. Given that we expect `/token` to only check that a certain person is a part of ICPC contests, and not to share any real secrets, we think that other getting access using the `/token` endpoint is not a security issue.

### 2. No plaintext Cognito codes downstream

Cognito authorization codes are encrypted before being forwarded to PocketBase or quest frontends. Only this service can decrypt and redeem them.

This prevents:

- Frontend misuse of Cognito credentials
- Accidental logging of redeemable codes
- Token exchange outside the intended flow

Operational note: the plaintext Cognito code is received by the `/loggedin` endpoint. Access logs and observability data on the auth domain must be protected accordingly.

### 3. Strict redirect validation

Only redirects of the form:

```
https://<quest>.${QUESTS_DOMAIN}/api/oauth2-redirect
```

are accepted. All hosts under `*.${QUESTS_DOMAIN}` are controlled by the same operator and are considered trusted infrastructure.

Quest names are validated using a strict allowlist pattern. HTTPS is required and the redirect path must match exactly. Open redirects are not possible.

### 4. Signed OAuth state

OAuth `state` values are signed using HMAC (HS256).

This ensures:

- State integrity
- Binding between OAuth flow and quest
- Protection against attacker-controlled callback parameters and quest swapping

### 5. Stateless operation

The service maintains no sessions or persistent state.

Benefits:

- No session fixation or storage compromise risks
- Simple horizontal scaling
- Easier auditing and reasoning

Statelessness is safe here because integrity is enforced via signed OAuth state and encrypted authorization codes.

## Cryptography

- HMAC (HS256) for state integrity
- JWE (AES-256-GCM) for code confidentiality and integrity
- JWT (HS256) for PocketBase token issuance

No custom cryptographic primitives are implemented. Standard, well-reviewed libraries are used.

## Known constraints and mitigations

- **No PKCE**: Cognito Hosted UI limitation; mitigated by encrypted code forwarding
- **ID tokens used as bearer**: Required by upstream ICPC APIs; treated as sensitive secrets
- **Client secret in request body**: Assumed server-to-server and protected accordingly
- **Contest IDs supplied at token exchange time**: Contest selection is not bound to `questName` by the proxy; correct contest configuration is therefore a security-relevant operational responsibility

If stricter isolation between quests and contests is required, contest identifiers should be cryptographically bound to the signed state or wrapped code.
