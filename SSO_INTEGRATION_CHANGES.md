# บันทึกสรุปการปรับปรุงระบบทั้งหมด (ALL LOGIN & Intranet SSO Integration)
**โครงการ:** `warehouse_dashboard/` (Next.js 16 App Router) ร่วมกับ Express Backend และ PostgreSQL Database  
**ที่ตั้งโครงการ:** `D:\Data warehoues\Project`  
**สถานะ:** เสร็จสมบูรณ์ทุกขั้นตอน (Stage 1 – Stage 5) พร้อมชุดทดสอบ Vitest 153 รายการและระบบ Docker 3-Container

---

## 1. ภาพรวมสถาปัตยกรรมและการตัดสินใจหลัก (Architecture & Key Decisions)

1. **สถาปัตยกรรม Dual-Auth ทำงานคู่ขนาน (Coexistence without regression):**
   - ระบบ SSO (ALL LOGIN + Intranet SSO) ทำงานควบคู่กับระบบยืนยันตัวตนเดิม (`ku_session`, `/api/v1/auth/*`, dashboard ดั้งเดิมทั้งหมด)
   - ไม่มีการเปลี่ยนแปลงหรือลบโค้ดการทำงานเดิมของ `ku_session` และหน้า `(dashboard)/*`
   - เส้นทาง SSO ใหม่ประกอบด้วย: `/sso/login`, `/sso/logout`, `/admin/*`, `/user/*`, `/forbidden`, `/api/auth/*`
2. **การจัดการ Path และ Origin แบบจุดเดียว (Single Source of Truth):**
   - `BASE_PATH` ถูกควบคุมผ่าน Environment Variable และอ่านเพียง 2 จุดคือ `next.config.ts` (สำหรับ basePath/assetPrefix) และ `src/lib/auth/paths.ts`
   - `PUBLIC_ORIGIN` กำหนด Public Scheme + Host จากภายนอก ป้องกัน Host Spoofing และบังคับ Fail-Closed ทันทีหากไม่ได้ระบุใน Production
3. **การรักษาความปลอดภัยของ Token และ Cookie:**
   - คุกกี้ทั้งหมด (`USER_SESSION`, `ACCESS_TOKEN`, `INTRANET_TOKEN`) ถูกตั้งค่าเป็น `HttpOnly: true`, `SameSite: 'lax'`, `Path: '/'`, และ `Secure: true` ในโหมด Production
   - ตัว `USER_SESSION` เข้ารหัสและเซ็นลายเซ็นดิจิทัลด้วย HMAC-SHA256 (HS256) โดยผูกค่า Cryptographic Hash ของทั้ง SSO Token และ Intranet Token เข้ากับ Session Payload เพื่อป้องกัน Token Substitution Attack
   - ปฏิเสธ Algorithm `none` หรือ Algorithm อื่นที่ไม่ใช่ HS256 โดยสิ้นเชิง
4. **การบังคับใช้สิทธิ์แบบเข้มงวด (Strict Role-Based Access Control):**
   - เส้นทาง `/admin/*` กำหนดให้ต้องมีบทบาท `admin` ตรงตัว (Case-sensitive)
   - เส้นทาง `/user/*` กำหนดให้มีบทบาท `user` หรือ `admin`
   - หากผู้ใช้ไม่มีบทบาทใดๆ จะถูกปฏิเสธสิทธิ์และ Redirect ไปยัง `/forbidden`
5. **การ Cache สิทธิ์ใน Memory (In-Memory Role Cache):**
   - Cache ผลการตรวจสอบสิทธิ์และ Roles เป็นเวลา 60 วินาที (`roleCache.ts`) เพื่อลดโหลดฝั่ง upstream
   - เมื่อผู้ใช้เรียก `/sso/logout` ระบบจะเรียก `invalidateAccess()` เพื่อลบ Cache ทันทีก่อนทำลายคุกกี้
   - ข้อกำหนดทางโครงสร้าง: Frontend ต้องรันแบบ **Single-Replica** (1 Container) ในระยะแรก เพื่อความถูกต้องของ Cache

---

## 2. รายละเอียดการพัฒนาในแต่ละส่วน (Detailed Stages)

### Stage 1: Auth Library Helpers (`warehouse_dashboard/src/lib/auth/`)
สร้างชุด Library ช่วยเหลือระดับแกนกลางที่ทำงานแบบ Framework-Agnostic และ Edge/Node-Compatible:
- `env.ts`: จัดการอ่าน Environment Variables อย่างปลอดภัย ตรวจสอบความถูกต้อง Fail-Closed ใน Production และบังคับ `CENTRAL_AUTH_STRICT_TLS=true`
- `paths.ts`: จัดการสร้าง Path และ Absolute URL (`appUrl`, `getPublicOrigin`, `stripBasePath`, `withBasePath`) รองรับทั้งมีและไม่มี `BASE_PATH`
- `jwt.ts`: สร้างและตรวจสอบ JWT ผ่าน Web Crypto API มาตรฐาน (`crypto.subtle`) รองรับ HS256 ตรวจสอบ signature, expiration, issuer และ audience
- `session.ts`: สร้าง `USER_SESSION` Token และฟังก์ชัน `verifySessionToken` ตรวจสอบความถูกต้องของ Session ร่วมกับ Token Hashes
- `cookies.ts`: จัดการชื่อคุกกี้ (`USER_SESSION`, `ACCESS_TOKEN`, `INTRANET_TOKEN`) และฟังก์ชันเซ็ต/ล้างคุกกี้แบบ `HttpOnly` และ `SameSite=Lax`
- `safeRedirect.ts`: ตรวจสอบและป้องกัน Open Redirect Attack ป้องกัน URL อันตราย เช่น `//evil.com`, `/\evil.com` หรือ Absolute External URLs
- `roleCache.ts`: ระบบ In-Memory Cache ขนาดจำกัด พร้อม TTL 60 วินาที และฟังก์ชัน `invalidateAccess()`
- `centralClient.ts`: ติดต่อระบบกลาง ALL LOGIN และ Intranet (`exchange-token`, `/me.php`, `/verify.php`, `/get-role`) พร้อมระบบจัดการ Timeout และ TLS Strict Verification
- `nontriId.ts`: ดึงค่า Nontri ID ตามลำดับความสำคัญ `uid` -> Intranet JWT `sub` -> ส่วนท้ายของ Profile `sub`
- `portalInput.ts`: ตรวจสอบความถูกต้องของ Input จาก Query หรือ Request Body พร้อมปฏิเสธ `accessToken` โดยตรงเมื่ออยู่ใน Production
- `httpResponse.ts`: Helper ฟังก์ชัน `jsonNoStore()` และ `redirectNoStore()` บังคับ Header `Cache-Control: no-store` ทุก Response
- `proxyRules.ts`: กฎการตัดสินใจ Routing สำหรับ Next.js Proxy
- `guard.ts`: ฟังก์ชัน Server Guard สำหรับ Layout ตรวจสอบสิทธิ์ก่อน Render หน้าเว็บ

---

### Stage 2a: SSO API Endpoints (`warehouse_dashboard/src/app/api/auth/`)
- **`GET/POST /api/auth/portal-session`**:
  - รับ `exchangeToken` และ `intranetToken`
  - แลกเปลี่ยนรหัสกับระบบกลางเพื่อรับ `ssoToken` แล้วดึงข้อมูลผู้ใช้จาก `/me.php`
  - สร้าง `USER_SESSION` JWT และบันทึกคุกกี้ 3 ตัวแบบ `HttpOnly`
  - กรณี GET (Browser Callback): ส่งรหัส 307 Redirect ไปยัง URL ปลายทางที่ปลอดภัย ปราศจาก Query Token
  - กรณี POST (API/Client Bootstrap): ส่งคืน JSON `{ session, user }` (ไม่เปิดเผย Token ดิบ)
- **`GET /api/auth/roles`**:
  - อ่านคุกกี้ทั้งสาม ตรวจสอบความถูกต้องของ Session
  - ตรวจสอบสถานะความถูกต้องกับ upstream และดึงสิทธิ์ผู้ใช้จาก Cache/ระบบกลาง
  - ส่งคืน `{ authenticated: true, roles: [...] }` หรือ 401 เมื่อหมดอายุ/ไม่มีสิทธิ์
- **`GET /api/auth/session`**:
  - อ่าน `USER_SESSION` จาก HttpOnly cookie
  - ส่งคืนข้อมูล `{ authenticated: true, user: sessionUser }` เพื่อให้ฝั่ง Client ดึงไปแสดงผลโดยไม่ต้องเข้าถึง Raw Cookie

---

### Stage 2b: Next.js 16 Proxy, Pages & Server Guards
- **`src/proxy.ts` (Next.js 16 Proxy Pattern):**
  - แทนที่ `src/middleware.ts` เดิมตามมาตรฐาน Next.js 16
  - รักษากระบวนการตรวจสอบ `ku_session` เดิม 100% พร้อมคง Open Redirect Prevention
  - เพิ่ม SSO Routing:
    - ดักจับการเข้าถึง `/admin/*` และ `/user/*` ที่มี Query Token (`exchangeToken` + `intranetToken`) แล้วส่งต่อไปยัง `/api/auth/portal-session`
    - หากไม่มี `USER_SESSION` จะส่ง Redirect (307) ไปยัง `/sso/login`
- **SSO Routes:**
  - `src/app/sso/login/route.ts`: รับ GET แล้วส่ง 307 Redirect ไปยัง `ENG_LOGIN_URL` ของระบบกลาง
  - `src/app/sso/logout/route.ts`: ล้าง Cache สิทธิ์ (`invalidateAccess`), ลบ Auth Cookies ทั้งหมด (`max-age=0, HttpOnly`), และส่ง 307 Redirect ไปยัง `ENG_LOGOUT_URL`
- **Server Guard Layouts & Pages:**
  - `src/app/admin/layout.tsx`: ตรวจสอบสิทธิ์ ต้องมีบทบาท `admin` เท่านั้น (หากไม่มี ส่งไป `/forbidden`)
  - `src/app/user/layout.tsx`: ตรวจสอบสิทธิ์ ต้องมีบทบาท `user` หรือ `admin`
  - `src/app/forbidden/page.tsx`: หน้าแจ้งเตือนเมื่อไม่มีสิทธิ์เข้าถึง พร้อมปุ่มสลับบัญชีและกลับหน้าหลัก

---

### Stage 3: Client-side Integration (`warehouse_dashboard/src/features/auth/`)
- **`SsoUserContext.tsx`:**
  - React Context สำหรับ Client Component ให้บริการ `{ user, status, refresh, logout }`
  - ดึงข้อมูลอัตโนมัติเมื่อ Mount ไปยัง `/api/auth/session` แบบ `credentials: "same-origin"` และ `cache: "no-store"`
  - ฟังก์ชัน `logout()` นำทางแบบ Full Page Navigation ไปยัง `/sso/logout` เพื่อล้างคุกกี้และ Session ฝั่ง Server อย่างสมบูรณ์

---

### Security Hardening & Bug Fixes (การปรับปรุงความปลอดภัย)
1. **Cache-Control No-Store:** บังคับ Header `Cache-Control: no-store` ทุก Response ของ Auth API เพื่อป้องกัน Browser/Proxy Caching ข้อมูล Session
2. **Host Spoofing Protection:** ปรับแก้ `src/proxy.ts` และ `portal-session/route.ts` ให้สร้าง Redirect URL จาก `PUBLIC_ORIGIN` ที่ตรวจสอบแล้ว แทนการพึ่งพา Request Header ที่อาจถูกปลอมแปลง
3. **Production Fail-Closed:** บังคับให้ระบบ Throw Error ทันทีใน Production หากไม่ได้ตั้งค่า `PUBLIC_ORIGIN`
4. **Logout Cache Invalidation:** ปรับแก้ `/sso/logout` ให้อ่านคุกกี้เพื่อระบุตัวตนและเรียก `invalidateAccess()` ก่อนลบคุกกี้ ป้องกันสิทธิ์ค้างใน Role Cache

---

### Stage 4: Containerization & Docker 3-tier Stack
จัดทำระบบ Container 3 ส่วนแยกกันบน Private Network (`ku_network`):
1. **Frontend Container (`warehouse_dashboard/Dockerfile`):**
   - Multi-stage build (Node 22 Alpine) สร้าง Next.js Standalone
   - รันด้วย Non-root user (`nextjs:nodejs`, UID 1001)
   - มี Healthcheck endpoint ที่ `/api/health`
   - กำหนด Build Argument `BACKEND_URL` และ `BASE_PATH` เพื่อรองรับ Next.js Standalone Rewrite
2. **Backend Container (`backend/Dockerfile`):**
   - Multi-stage build (Node 22 Alpine, Express 5)
   - รันด้วย Non-root user (`expressjs:nodejs`)
   - แก้ไขปัญหา Express Hardcoded `127.0.0.1` ใน Container ด้วย `-r ./bind-all.cjs` เพื่อให้รับการเชื่อมต่อข้าม Container ได้ที่ `0.0.0.0` โดยไม่ต้องแก้โค้ดต้นฉบับ
   - จัดการ Permission โฟลเดอร์ `/app/uploads` ล่วงหน้า
3. **Database Container (`postgres:16-alpine`):**
   - ใช้งาน Persistent Named Volume `ku_warehouse_pgdata`
   - มี Healthcheck ผ่าน `pg_isready`
4. **Compose Configuration:**
   - `docker-compose.yml`: สำหรับ Production Stack (Database ซ่อนอยู่บนเครือข่ายภายใน ไม่เปิดพอร์ตสู่ภายนอก)
   - `docker-compose.dev.yml`: สำหรับ Local Development (เปิดพอร์ต Database `127.0.0.1:5432` สำหรับทดสอบ)
   - `docs/DEPLOY.md`: คู่มือขั้นตอนการ Build, Deploy, การตั้งค่า Reverse Proxy และการเปลี่ยน `BASE_PATH`

---

### Stage 5: Documentation & API Test Assets
1. **`ALL_LOGIN_DOC/postmancollection.ours.json`:**
   - Postman Collection v2.1 ปรับปรุงสำหรับเส้นทางของ Warehouse Dashboard
   - จัดกลุ่มโฟลเดอร์ A ถึง E ครบถ้วน (รวมทดสอบ `/api/auth/session` ทั้งแบบ Authenticated และ Unauthenticated)
   - สคริปต์ Test ในทุก Request ยืนยัน HTTP Status, Header `Cache-Control: no-store`, ตรวจสอบว่าไม่มี Token ดิบรั่วไหลใน Response Body และตรวจสอบ `HttpOnly` บนคุกกี้ทั้งหมด
   - ตัวแปรความลับทั้งหมดถูกเว้นว่าง (`""`) ตามมาตรฐานความปลอดภัย
2. **`ALL_LOGIN_DOC/UNVERIFIED.md`:**
   - บันทึกรายการข้อสมมติฐานที่รอการตรวจสอบกับระบบจริงของคณะ (Schemas, Token TTL, Single-use, Intranet Signing Key, Token Expiration Absence, Logout Revocation)
   - สรุปมาตรการความปลอดภัยส่วนเพิ่ม (Defense-in-depth) ที่ระบบเราทำเพิ่มเติมจากเอกสารอ้างอิง
3. **`docs/GO-LIVE-CHECKLIST.md`:**
   - รายการตรวจสอบก่อนขึ้นระบบจริง (Checklist) ครอบคลุม 6 หมวด: (a) Portal admin prerequisites, (b) Infrastructure & reverse proxy, (c) Production secrets & TLS, (d) Single-replica frontend enforcement, (e) Browser acceptance test scenarios, (f) Rollback & BASE_PATH rebuild procedure

---

## 3. สรุปสถานะการทดสอบ (Verification & Test Status)

- **Unit Tests (Vitest):**
  - จำนวน Test Suites: 16 Suites
  - จำนวน Tests ที่ผ่าน: 153 Tests (100% Passed)
  - ครอบคลุม: `proxyRules`, `session`, `env-paths-cookies`, `guard`, `logout`, `roles`, `portal-session`, `safeRedirect`, `normalizeRoles`, `portalInput`, `nontriId`, `SsoUserContext`, `centralClient`
- **Docker Smoke Test:**
  - ผ่านการทดสอบ Build และรันทั้ง 3 Containers (`ku_warehouse_frontend`, `ku_warehouse_backend`, `ku_warehouse_db`)
  - Healthcheck ทุกตัวขึ้นสถานะ `healthy`
- **JSON Validation:**
  - ตรวจสอบความถูกต้องของ `ALL_LOGIN_DOC/postmancollection.ours.json` ผ่าน Node.js `JSON.parse` เรียบร้อย

---

## 4. บัญชีรายชื่อไฟล์ที่ถูกสร้างและปรับปรุง (Manifest of Files)

| ลำดับ | เส้นทางไฟล์ | การดำเนินการ | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| 1 | `warehouse_dashboard/src/lib/auth/*` | สร้างใหม่ | ชุด Helper แกนกลาง (14 ไฟล์: env, paths, jwt, cookies, safeRedirect, roleCache, centralClient, nontriId, portalInput, httpResponse, proxyRules, guard, profile, session) |
| 2 | `warehouse_dashboard/src/app/api/auth/*` | สร้างใหม่ | API Routes สำหรับ SSO (`portal-session`, `roles`, `session`) |
| 3 | `warehouse_dashboard/src/proxy.ts` | สร้างใหม่ | Next.js 16 Proxy แทนที่ `src/middleware.ts` |
| 4 | `warehouse_dashboard/src/middleware.ts` | ลบ | ย้ายไปเป็น `src/proxy.ts` |
| 5 | `warehouse_dashboard/src/app/sso/*` | สร้างใหม่ | เส้นทาง SSO Login (`/sso/login`) และ Logout (`/sso/logout`) |
| 6 | `warehouse_dashboard/src/app/admin/layout.tsx` | สร้างใหม่ | Server Guard สำหรับบทบาท `admin` |
| 7 | `warehouse_dashboard/src/app/user/layout.tsx` | สร้างใหม่ | Server Guard สำหรับบทบาท `user` หรือ `admin` |
| 8 | `warehouse_dashboard/src/app/forbidden/page.tsx` | สร้างใหม่ | หน้า Forbidden 403 สำหรับผู้ใช้ที่ไม่มีสิทธิ์ |
| 9 | `warehouse_dashboard/src/features/auth/context/SsoUserContext.tsx` | สร้างใหม่ | React Context สำหรับฝั่ง Client |
| 10 | `warehouse_dashboard/src/**/__tests__/*` | สร้างใหม่ | ชุดทดสอบ Unit Tests ทั้งหมด 16 ไฟล์ 153 เคส |
| 11 | `warehouse_dashboard/Dockerfile` + `.dockerignore` | สร้างใหม่ | Dockerfile แบบ Standalone ของ Next.js 16 |
| 12 | `backend/Dockerfile` + `.dockerignore` | สร้างใหม่ | Dockerfile แบบ Multi-stage สำหรับ Express 5 Backend |
| 13 | `docker-compose.yml` | ปรับปรุง | Production Compose Stack 3 Containers พร้อมเครือข่ายภายใน |
| 14 | `docker-compose.dev.yml` | สร้างใหม่ | Dev Compose Stack เผยแพร่พอร์ตฐานข้อมูลบน localhost |
| 15 | `.env.*.example` | สร้างใหม่/ปรับปรุง | Template ตัวแปรสำหรับ Frontend, Backend และ Database |
| 16 | `docs/DEPLOY.md` | สร้างใหม่ | เอกสารแนวทางการ Deploy และ Reverse Proxy Requirements |
| 17 | `ALL_LOGIN_DOC/postmancollection.ours.json` | สร้างใหม่ | Postman Collection v2.1 สำหรับทดสอบ API และ Assertions |
| 18 | `ALL_LOGIN_DOC/UNVERIFIED.md` | สร้างใหม่ | เอกสารข้อสมมติฐานระบบกลางและ Defense-in-depth Deviations |
| 19 | `docs/GO-LIVE-CHECKLIST.md` | สร้างใหม่ | Checklist ตรวจสอบความพร้อมก่อนขึ้น Production |
| 20 | `SSO_INTEGRATION_CHANGES.md` | สร้างใหม่ | ไฟล์สรุปภาพรวมการแก้ไขระบบทั้งหมด (ไฟล์นี้) |
