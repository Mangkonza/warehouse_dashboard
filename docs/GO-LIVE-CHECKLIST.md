# Go-Live Checklist: ALL LOGIN & Intranet SSO

### (a) Portal Admin Prerequisites
- [ ] Confirm `ENG_SYSTEM_ID` registered in Central Intranet with valid role mappings.
- [ ] Confirm callback URL registered in Central Portal: `<PUBLIC_ORIGIN><BASE_PATH>/admin` (or `/user`).
- [ ] Verify upstream endpoints (`exchange-token`, `me.php`, `verify.php`, `get-role`) are accessible.
- [ ] Confirm exchange token TTL, single-use policy, and intranet token lifetime.

### (b) Infrastructure & Reverse Proxy
- [ ] External reverse proxy terminates HTTPS and redirects HTTP (port 80) to HTTPS (port 443).
- [ ] Reverse proxy overwrites (does not append) `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto` (`https`).
- [ ] Outbound HTTPS (port 443) allowed from frontend container to `office.eng.kps.ku.ac.th` and `eng.kps.ku.ac.th`.
- [ ] Reverse proxy disables caching (`Cache-Control: no-store`) on all `/api/auth/*` routes.

### (c) Production Secrets & TLS
- [ ] Generate high-entropy `JWT_COOKIE_SECRET` (min 32 chars, `openssl rand -base64 48`) in `.env.frontend`.
- [ ] Generate high-entropy `AUTH_SESSION_SECRET` (min 32 chars) in `.env.frontend` and `.env.backend`.
- [ ] Verify `PUBLIC_ORIGIN` matches exact public scheme + host without trailing slash.
- [ ] Verify `CENTRAL_AUTH_STRICT_TLS=true` (never false in production) with valid CA certificates.

### (d) Single-Replica Frontend Enforcement
- [ ] Frontend deployed as single replica (`deploy.replicas: 1`) to preserve in-memory role cache.
- [ ] If multi-replica needed in future, sticky sessions or distributed Redis cache must be added first.

### (e) Browser Acceptance Test Scenarios
- [ ] Visiting `/sso/login` redirects to Central Portal login page (`ENG_LOGIN_URL`).
- [ ] Portal callback with tokens redirects to `/admin` without tokens visible in browser URL bar.
- [ ] Session cookies (`USER_SESSION`, `ACCESS_TOKEN`, `INTRANET_TOKEN`) set as `HttpOnly`, `SameSite=Lax`, `Secure`.
- [ ] User with `admin` role accesses `/admin`; user without `admin` redirected to `/forbidden`.
- [ ] User with `user` role accesses `/user`; user without any role redirected to `/forbidden`.
- [ ] Visiting `/sso/logout` clears all auth cookies and redirects to Central Portal logout.

### (f) Rollback & BASE_PATH Rebuild Procedure
- [ ] To rollback: restore previous Docker image tags and restart compose stack.
- [ ] If changing `BASE_PATH`: update `BASE_PATH` in `.env.frontend`, rebuild (`docker compose build frontend`), and redeploy.
- [ ] Existing `ku_session` legacy authentication remains operational throughout rollback or rebuild.
