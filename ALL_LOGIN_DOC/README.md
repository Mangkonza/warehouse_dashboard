# คู่มือเชื่อมต่อ ALL LOGIN และ Intranet

คู่มือสำหรับ kukps-eng-personnel-web • ตรวจจาก source code วันที่ 26 ตุลาคม 2026

เอกสารนี้อธิบายพฤติกรรมที่โค้ดฝั่งเว็บใช้อยู่จริง ไม่ใช่ข้อยืนยันสัญญาทั้งหมดของระบบกลาง ยังไม่ได้ทดสอบกับ ALL LOGIN / Intranet จริง และไม่ได้เปลี่ยนโค้ดระบบ ข้อมูล URL อ้างอิงจาก configuration ปัจจุบัน ส่วน token และ secret ต้องกรอกเอง

## 1. ไฟล์และขอบเขต

- README.md: คู่มือสำหรับนักพัฒนาและผู้ตั้งค่าระบบ
- postmancollection.json: Postman Collection v2.1 สำหรับ import แล้วเรียก endpoint
- index.html: คู่มือเดียวกันในรูปแบบเว็บ เปิดอ่านออฟไลน์และพิมพ์เป็น PDF ได้

การสร้าง session และตรวจ ALL LOGIN / Intranet อยู่ใน Next.js ไม่ใช่ NestJS personnel API ที่ repository ข้างเคียง ไม่ควรนำ JWT ของเว็บไปถือว่าเป็น Bearer token ของ personnel API โดยอัตโนมัติ

## 2. Token และหน้าที่

| ค่า                    | ที่มา / การใช้งาน                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| exchangeToken          | Portal ส่งมาให้เว็บ ใช้ POST แลกกับ ENG_TOKEN_EXCHANGE_URL; ให้ถือเป็นรหัสใช้ครั้งเดียวตาม flow และรับใหม่เมื่อต้องทดลองอีกครั้ง อายุและเงื่อนไขการใช้ซ้ำต้องยืนยันกับเจ้าของ Portal |
| ssoToken / accessToken | ผลแลก token ชื่อ ssoToken ถูกนำไปเป็น Bearer ของ me และ verify และเก็บใน ACCESS_TOKEN                                                                                                |
| intranetToken          | Portal ส่งแยกมา ใช้ Bearer ของ get-role และเก็บใน INTRANET_TOKEN                                                                                                                     |
| USER_SESSION           | JWT HS256 ที่เว็บสร้างเองสำหรับข้อมูลผู้ใช้ ไม่ใช่ SSO token และไม่ใช่แหล่ง roles                                                                                                    |

ห้ามสลับ SSO token กับ Intranet token และไม่ควรส่ง accessToken พร้อม exchangeToken: นอก production โค้ดเลือก accessToken ก่อน ส่วน production ปฏิเสธทันทีหากมี accessToken

## 3. Flow การเข้าสู่ระบบ

1. ผู้ใช้เปิด /login ภายใต้ base path หรือเปิด /admin, /user โดยไม่มี USER_SESSION → middleware redirect ไป ENG_LOGIN_URL
2. ระบบ Portal ทำขั้นตอนเข้าสู่ระบบและส่งผู้ใช้กลับพร้อม exchangeToken และ intranetToken; วิธีตั้งค่าปุ่มระบบและ callback ฝั่ง Portal ต้องประสานผู้ดูแล เพราะไม่มีโค้ด Portal ใน repository นี้
3. ตัวอย่าง URL กลับเข้าเว็บ: https://YOUR-WEB-HOST/kukps-eng-personnel-web/admin?exchangeToken=URL_ENCODED_CODE&intranetToken=URL_ENCODED_TOKEN
4. middleware ของ /admin และ /user ส่งต่อไป GET /api/auth/portal-session พร้อม next ที่เป็น path เดิมและตัด token query ออก
5. Next.js POST ไป exchange-token ด้วย exchangeToken → ต้องได้ HTTP 2xx, status=success และ ssoToken ที่ไม่ว่าง
6. Next.js GET me ด้วย Bearer SSO → ต้องได้ HTTP 2xx และ profile หรือ user
7. เว็บสร้าง USER_SESSION และตั้ง ACCESS_TOKEN / INTRANET_TOKEN แล้ว GET route redirect กลับ next; POST route ส่ง JSON {session,user}
8. GET /api/auth/roles ใช้ cookie ทั้งสาม อ่าน nontriId จาก session แล้วเรียก verify กับ get-role พร้อมกัน ตรวจสถานะเข้าสู่ระบบและคืน roles
9. /admin ต้องมี role ชื่อ admin ตรงตัว; authenticated=false หรือ error จะไป /logout ส่วนไม่มี admin จะไป /home

URL ทั้งหมดในเอกสารที่ขึ้นต้น /api, /login, /logout, /admin, /user ต้องต่อหลัง /kukps-eng-personnel-web ใน deployment ปัจจุบัน หน้าอื่นอาจรับ query ผ่าน UserProvider แล้ว POST bootstrap ได้ แต่เส้นทางที่ middleware จัดการชัดเจนคือ /admin และ /user

## 4. ตั้งค่า environment ฝั่งเว็บ

ตัวอย่างสำหรับพัฒนาใน .env.local (แทนค่าของตัวเอง ห้ามนำ placeholder secret ไปใช้งานจริง):

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:4000
NEXT_PUBLIC_BASE_PATH=/kukps-eng-personnel-web
ENG_LOGIN_URL=https://office.eng.kps.ku.ac.th/eng-main/home
ENG_LOGOUT_URL=https://office.eng.kps.ku.ac.th/eng-main/useraccess
ENG_TOKEN_EXCHANGE_URL=https://office.eng.kps.ku.ac.th/eng-main/api/external/exchange-token
ENG_AUTH_ME_URL=https://eng.kps.ku.ac.th/std-eng-auth-service/api/me.php
ALL_LOGIN_STATUS_URL=https://eng.kps.ku.ac.th/std-eng-auth-service/api/verify.php
ENG_MAIN_ROLE_URL=https://office.eng.kps.ku.ac.th/eng-main/api/external/get-role
ENG_SYSTEM_ID=<SYSTEM_ID_FROM_INTRANET_ADMIN>
JWT_COOKIE_SECRET=<LONG_RANDOM_PRIVATE_SECRET>
CENTRAL_AUTH_STRICT_TLS=true
```

- production ใช้ NEXT_PUBLIC_APP_URL=https://office.eng.kps.ku.ac.th หรือ origin สาธารณะจริง ตัวแปรนี้กำหนด origin สำหรับ redirect; หากใช้ค่า production ตอนทดสอบ local จะถูกส่งออกจาก localhost
- next.config.ts กำหนด basePath และ assetPrefix แบบตายตัวเป็น /kukps-eng-personnel-web ดังนั้นเปลี่ยน NEXT_PUBLIC_BASE_PATH อย่างเดียวไม่พอ ต้องให้ตรงกันและ build ใหม่เมื่อเปลี่ยนค่าที่เกี่ยวข้องกับ client
- ตั้ง ENG_SYSTEM_ID ให้ตรงระบบที่ลงทะเบียนใน Intranet และให้เจ้าของระบบจัด role ของผู้ใช้ โดย repository ไม่ระบุวิธีออก token หรือจัดสรร role
- JWT_COOKIE_SECRET มีลำดับ fallback เป็น NEXTAUTH_SECRET แล้วเป็นข้อความคงที่ kukps-eng-personnel-web จึงควรตั้ง secret จริงทุก deployment
- CENTRAL_AUTH_STRICT_TLS ต้องเป็นข้อความ true ตรงตัวเพื่อเปิดตรวจ certificate; หากไม่ตั้ง โค้ดปัจจุบันปิดการตรวจ TLS ของการเรียกระบบกลาง
- npm run dev ใช้พอร์ต 4000; npm run start ไม่ได้ระบุพอร์ตใน script จึงต้องกำหนดตาม deployment เอง รีสตาร์ต process หลังแก้ server environment
- reverse proxy ควรส่ง x-forwarded-host และ x-forwarded-proto ให้ถูกต้อง เมื่อ NEXT_PUBLIC_APP_URL ใช้ได้ โค้ดจะเลือก origin จากตัวแปรนี้ก่อน forwarded headers

## 5. Endpoint ของระบบกลาง

รายการต่อไปนี้คือ contract ที่เว็บคาดหวังจาก source code ต้องยืนยันรายละเอียดเพิ่มเติมกับผู้ดูแลระบบกลาง

| Method / ตัวแปร URL         | Auth / input                                   | เงื่อนไขผลลัพธ์ที่เว็บใช้                                             |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| POST ENG_TOKEN_EXCHANGE_URL | JSON {exchangeToken}; ไม่มี Bearer ในโค้ด      | HTTP 2xx และ {status:success,ssoToken:...}                            |
| GET ENG_AUTH_ME_URL         | Bearer accessToken                             | HTTP 2xx และ {profile:{...}} หรือ {user:{...}}                        |
| GET ALL_LOGIN_STATUS_URL    | Bearer accessToken                             | HTTP 2xx และ active===true หรือ authenticated===true ต้องเป็น boolean |
| GET ENG_MAIN_ROLE_URL       | Bearer intranetToken; query nontriId, systemId | HTTP 2xx และข้อมูล roles ที่ normalize ได้                            |

ตัวอย่างเชิงโครงสร้าง ไม่ใช่ข้อมูลจริง:

```json
{
  "status": "success",
  "ssoToken": "<SSO_TOKEN>"
}
```

```json
{
  "profile": {
    "uid": "example.nontri",
    "first-name": "ชื่อ",
    "last-name": "นามสกุล",
    "google-mail": "example@ku.th",
    "faculty": "คณะวิศวกรรมศาสตร์"
  }
}
```

```json
{ "active": true }
```

```json
{ "roles": ["admin", "user"] }
```

normalizeRoles รองรับ array ของ string หรือ object ที่มี role, roleName, name, role_name หรือ roleCode; object ชั้นนอกอ่าน roles → data → role ตามลำดับ และรองรับ string ใน field เหล่านั้น แต่ bare string ที่ root ไม่ถูกแปลงเป็น role ไม่มีการเปลี่ยนตัวพิมพ์เล็ก/ใหญ่

## 6. Endpoint ฝั่งเว็บ

| Method / path                 | Input / output                                                                     | หมายเหตุ                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| GET /api/auth/portal-session  | query exchangeToken + intranetToken และ next แบบ optional; สำเร็จ 307 + Set-Cookie | เหมาะกับ browser callback; next default / และยอมรับเฉพาะ path ใน origin เดียว         |
| POST /api/auth/portal-session | JSON {exchangeToken,intranetToken}; สำเร็จ 200 {session,user} + Set-Cookie         | เหมาะกับ client bootstrap และ Postman; ไม่ได้คืน roles ใน user                        |
| GET /api/auth/roles           | cookies; สำเร็จ 200 {authenticated:true,roles:[...]}                               | ไม่ใช้ Authorization header จาก caller เพื่อสร้าง session                             |
| GET /login                    | 307 ไป ENG_LOGIN_URL                                                               | ไม่มีการเติม callback / state parameter โดย middleware ต้องตั้งที่ Portal ให้สอดคล้อง |
| GET /logout                   | ลบ cookie ทั้งสาม แล้ว 307 ไป ENG_LOGOUT_URL                                       | ไม่พบการเรียก token revocation API จากเว็บ ผล logout ระบบกลางขึ้นกับปลายทาง           |

ตัวอย่าง POST:

```http
POST http://localhost:4000/kukps-eng-personnel-web/api/auth/portal-session
Content-Type: application/json

{"exchangeToken":"<FRESH_CODE>","intranetToken":"<INTRANET_TOKEN>"}
```

โหมดทดสอบนอก production อนุญาตแทน exchangeToken ด้วย accessToken ใน GET/POST ได้ ส่วน NODE_ENV=production คืน 403 เมื่อส่ง accessToken แม้จะส่ง exchangeToken มาด้วย อย่าเปิดใช้ direct-token flow เป็นแนวทาง production

## 7. Session, profile และสิทธิ์

- nontriId ที่ใช้เรียก get-role มาจาก user.uid → intranet JWT sub → ส่วนท้ายของ user.sub หลังเครื่องหมาย colon ตามลำดับ
- firstName อ่าน first-name หรือ givenname; lastName อ่าน last-name หรือ surname; name อ่าน thainame หรือชื่อรวม; email อ่าน google-mail → office365-mail → userprincipalname
- exp และ iat ให้ความสำคัญกับ Intranet JWT ก่อน SSO JWT; หากไม่มี exp จะไม่กำหนด maxAge และตัวตรวจอายุจะไม่ถือว่าหมดอายุเพราะไม่มี exp
- ทั้งสาม cookie ใช้ Path=/ และ SameSite=Lax โดยไม่ระบุ Domain; ACCESS_TOKEN และ INTRANET_TOKEN เป็น HttpOnly และ Secure เฉพาะ production
- USER_SESSION อ่านได้จาก JavaScript และไม่ได้ตั้ง Secure หรือ HttpOnly ในโค้ดปัจจุบัน; bootstrap ยังลบ legacy cookie kukps_eng_personnel_user, token, role_token
- authGuard cache ผล verify + roles ใน memory ของแต่ละ process เป็นเวลา 60 วินาที โดย key แยกตาม nontriId และ token ทั้งสอง การแก้ role หรือ logout กลางอาจยังไม่สะท้อนจน cache หมดอายุ
- middleware ตรวจแค่การมี USER_SESSION; /admin มี server role guard จริง แต่ /user/layout.tsx comment server role guard ไว้ อย่าถือว่า /user บังคับ role user แล้ว
- createSessionJwt เซ็น HS256 แต่ getCurrentRoles อ่าน payload ด้วย decodeJwtPayload โดยไม่ได้ตรวจ signature ของ USER_SESSION; bootstrap ไม่ได้ตรวจ Intranet token กับ get-role จนกว่าจะอ่าน roles การสร้าง session สำเร็จจึงไม่ยืนยันสิทธิ์

ข้อจำกัดข้างต้นเป็นสิ่งที่พบจากโค้ด ไม่ได้แก้ในงานเอกสารนี้ หากนำแนวทางไปใช้ในระบบใหม่ควรตรวจ signature, อายุ, issuer/audience และความสัมพันธ์ของตัวตนจาก token ที่เชื่อถือได้ พร้อมออกแบบการบังคับสิทธิ์ฝั่ง server ให้ครบ

## 8. ใช้งาน Postman Collection

1. Import postmancollection.json ใน Postman แล้วเลือก collection นี้
2. ตั้ง webBaseUrl เป็น URL เว็บรวม base path โดยไม่มี slash ปิดท้าย ค่าเริ่มต้น http://localhost:4000/kukps-eng-personnel-web
3. ตั้ง systemId และ nontriId; ตัวแปร endpoint ระบบกลางเตรียม URL ตาม configuration ปัจจุบันไว้แล้ว ปรับได้ตาม environment
4. ใส่ exchangeToken / intranetToken / accessToken เฉพาะ local value หรือ environment ส่วนตัว อย่า export token จริงหรือ sync ลงไฟล์คู่มือ
5. เลือก flow A: รัน A1 POST bootstrap ด้วย exchangeToken ใหม่ → A2 GET roles โดยเปิด cookie jar; server เป็นผู้แลก code ให้ ไม่ต้องรัน B1 ก่อน
6. เลือก flow B สำหรับตรวจ upstream: B1 แลก code ใหม่ → B2 me → B3 verify → B4 get-role; B1 เก็บ accessToken เป็นตัวแปร local ของ collection และ B2 ช่วยเก็บ nontriId จาก profile ตามลำดับเดียวกับเว็บ
7. Flow B ใช้ code ไปแล้ว จึงต้องรับ code ใหม่เพื่อรัน A1; ห้ามรันทั้ง collection แบบลำดับอัตโนมัติโดยหวังใช้ code เดิมซ้ำ
8. Flow C: GET callback เป็นทางเลือกแทน A1 ต้องใช้ code ใหม่ ปิด Follow redirects ใน request นี้เพื่อดู 307, Location และ Set-Cookie; อย่าส่ง token ผ่านช่อง URL ของเว็บสาธารณะหรือบันทึก URL ที่มี token
9. Flow D: direct accessToken POST ใช้เฉพาะ development; negative cases ใช้ POST {} และ GET roles แบบปิด cookie jar เพื่อตรวจ 400 / 401 ส่วน login/logout ปิด Follow redirects เพื่อไม่ตามไปถึงหน้า Portal
10. หลัง logout ใน Postman ให้ทดสอบ roles อีกครั้งด้วย cookie jar เดิม; Postman กับ browser ไม่แชร์ cookie jar ต้องทดสอบ browser แยก

Postman เรียก API server-to-server ได้ แต่ไม่จำลองการ login แบบโต้ตอบหรือ SameSite ของ browser; cookie แบบ Secure ใน production ต้องเรียก HTTPS จึงใช้งานได้ Collection ไม่มี username/password หรือวิธีขอ token ใหม่อัตโนมัติ เพราะไม่พบ contract ส่วนนั้น

## 9. Error และการแก้ปัญหา

| อาการ / status                                                 | ความหมายและจุดตรวจ                                                                                                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| bootstrap 400                                                  | ไม่มี exchangeToken/accessToken หรือไม่มี intranetToken; ตรวจชื่อ field ให้ตรง                                                                                                                         |
| bootstrap 403                                                  | ส่ง accessToken ตอน production ให้ใช้ exchangeToken ใหม่แทน                                                                                                                                            |
| bootstrap 500 Missing ENG_AUTH_ME_URL / ENG_TOKEN_EXCHANGE_URL | ตั้ง server environment แล้ว restart                                                                                                                                                                   |
| Cannot exchange portal token                                   | ตรวจ code ใหม่ URL และผล upstream; โค้ดส่ง status ของ upstream กลับแม้ body ไม่ผ่านเงื่อนไข ดังนั้นกรณี upstream 200 แต่ status ไม่ใช่ success อาจยังเป็น HTTP 200 ที่มี error body ต้องตรวจ body ด้วย |
| Cannot load central user data                                  | me ตอบไม่ใช่ 2xx; ตรวจ SSO token ไม่ใช่ Intranet token                                                                                                                                                 |
| bootstrap 502 Invalid central user data                        | me ไม่มี profile หรือ user ตามที่เว็บคาดหวัง                                                                                                                                                           |
| bootstrap 500 Cannot create portal session                     | exception เช่น network/TLS/JSON ไม่ถูกต้อง ดู error และ cause โดยไม่เผย token                                                                                                                          |
| roles 401                                                      | ไม่มี session/token ครบ, session หมดอายุ หรือ verify ไม่ให้ active/authenticated เป็น true; response อาจมี roles จาก upstream แม้ authenticated=false                                                  |
| roles 500                                                      | upstream verify/get-role ไม่ใช่ 2xx, network error หรือขาด ALL_LOGIN_STATUS_URL / ENG_MAIN_ROLE_URL / ENG_SYSTEM_ID                                                                                    |
| admin กลับ home                                                | เข้าสู่ระบบแล้วแต่ไม่มี role admin ตรงตัว ตรวจ systemId/nontriId และรอ cache 60 วินาที                                                                                                                 |
| redirect ไป host/path ผิด                                      | ตรวจ NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_BASE_PATH, next.config.ts และ forwarded headers                                                                                                                  |
| เข้าแล้วหลุด / cookie ไม่ติด                                   | ตรวจ origin ที่ใช้จริง HTTPS ใน production cookie jar, exp ของ token และ cookie ชื่อซ้ำจากระบบอื่นที่ Path=/                                                                                           |

## 10. Checklist รับมอบการเชื่อมต่อ

- ผู้ดูแล Portal ยืนยัน systemId, callback URL, รูปแบบ token, อายุ code และการออก role
- ตั้ง public origin และ base path ตรง reverse proxy / Next.js และใช้ TLS ที่ตรวจ certificate ได้
- browser: เข้า Portal → กลับ /admin พร้อม code → URL ปลายทางไม่มี token → โหลด profile และ roles ได้
- Postman: bootstrap มี Set-Cookie ทั้งสาม และ roles ตอบ authenticated=true พร้อมสิทธิ์ที่คาดหวัง
- ทดสอบไม่มี admin, session หมดอายุ, verify false, code ใช้ซ้ำ/หมดอายุ และ upstream ล่มใน environment ทดสอบตามสัญญาที่ผู้ดูแลยืนยัน
- ทดสอบ logout ทั้ง browser และระบบกลาง รวมถึงผล cache; ยืนยัน /user guard และการตรวจ signature ก่อนอาศัยเป็น security boundary

## 11. แหล่งอ้างอิงและการตรวจเอกสาร

เส้นทางต่อไปนี้อ้างอิงจาก repository root:

- src/middleware.ts: redirect login/logout, รับ token query, ตรวจ cookie เบื้องต้น
- src/app/api/auth/portal-session/route.ts: exchange, me, GET/POST bootstrap, redirect และ cookie
- src/app/api/auth/roles/route.ts: HTTP status ของ session/roles
- src/app/utils/authGuard.ts: verify, get-role, normalizeRoles และ cache
- src/app/utils/serverJwt.ts และ src/app/utils/jwt.ts: การสร้าง JWT และ decode/expiry
- src/app/contexts/userContext.tsx: client bootstrap, profile, query cleanup และ logout
- src/app/admin/layout.tsx และ src/app/user/layout.tsx: การบังคับ role ในหน้าเว็บ
- next.config.ts และ package.json: base path และพอร์ต development

ตรวจไฟล์ JSON และรูปแบบเอกสารได้ในเครื่อง การตรวจเหล่านี้ไม่ยืนยันการเชื่อมต่อจริงกับระบบกลาง ต้องใช้ token ที่ผู้ดูแลออกให้และทดสอบ flow ตาม checklist แยกต่างหาก
