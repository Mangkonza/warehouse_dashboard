# Unverified Portal Assumptions & Security Deviations

## 1. Unverified Assumptions (Require Live Portal Confirmation)
- **Response Schemas**: Central responses (`exchange-token`, `me.php`, `verify.php`, `get-role`) assumed to match reference structure (`status:success`, `ssoToken`, `profile`/`user`, boolean `active`/`authenticated`, role array/object).
- **Exchange Token Lifecycle**: Assumed single-use with short TTL; behavior on reuse, expiry, or replay is unverified against upstream.
- **Intranet JWT Signature & Key**: Intranet token verified structurally only; upstream signing algorithm and public keys are unverified.
- **Token Expiry Absence**: If upstream omits `exp`, tokens default to non-expiring; upstream maximum lifetime is unverified.
- **Logout Revocation**: `/sso/logout` clears local cookies and role cache but does not revoke upstream tokens (upstream revocation API unverified).
- **Portal Configuration**: `ENG_SYSTEM_ID` value and callback URL registration in Central Portal require admin confirmation.
- **TLS Certificates**: Production enforces strict TLS (`CENTRAL_AUTH_STRICT_TLS=true`); upstream CA trust chain must be valid.
- **Reverse Proxy Headers**: External proxy must overwrite (not append) `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto` (`https`).
- **Single-Replica Constraint**: Role cache and brute-force mitigation are in-memory; scaling requires sticky sessions or shared cache.
- **Role Cache Staleness**: In-memory role cache holds permissions for 60 seconds; upstream role changes take up to 60s to propagate.

## 2. Intentional Defense-in-Depth Deviations from Reference
- **HttpOnly `USER_SESSION`**: Reference left `USER_SESSION` accessible to client JavaScript; our implementation enforces `HttpOnly; SameSite=Lax; Secure` (prod) and serves user profile via `GET /api/auth/session`.
- **Strict Token Binding**: Session JWT binds cryptographic hashes of both `ssoToken` and `intranetToken`, preventing token-swap attacks.
- **Exact Case-Sensitive Roles**: Role authorization requires exact string matches (e.g. `admin`, `user`); case folding and partial matches are denied.
