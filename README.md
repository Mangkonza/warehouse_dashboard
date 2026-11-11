# ระบบคลังข้อมูลและแดชบอร์ดบริหารจัดการข้อมูลหน่วยวิจัยและนวัตกรรม
## คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์
**(KU Engineering Kamphaeng Saen Data Warehouse & Executive Dashboard)**

---

## 1. ภาพรวมโครงสร้างของโปรเจกต์ (Project Architecture & Structure)

โปรเจกต์นี้ได้รับการพัฒนาภายใต้สถาปัตยกรรมแยกส่วน (Decoupled Microservice Architecture) โดยแบ่งออกเป็น 3 บริการหลัก:
1. **Frontend Web Application (`warehouse_dashboard`)**: พัฒนาด้วย Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS และ Chart.js สำหรับการแสดงผลแดชบอร์ด รายงานยุทธศาสตร์ และระบบบริหารจัดการข้อมูล
2. **Backend API Service (`backend`)**: พัฒนาด้วย Node.js 22, Express.js 5, TypeScript และ Prisma ORM ให้บริการ RESTful API, ระบบตรวจสอบสิทธิ์, การประเมินผลงานอัตโนมัติ (SDGs/TRL/Quartile) และ Strategic KPI Engine
3. **Database (`PostgreSQL 16`)**: ทำงานเป็น **Standalone / Native PostgreSQL Service** ติดตั้งโดยตรงบน Server (ไม่ได้รันผ่าน Docker Container เพื่อความเสถียรและประสิทธิภาพ I/O สูงสุดในการวิเคราะห์ข้อมูล)

```
warehouse_dashboard/
├── deploy.sh                          # สคริปต์อัตโนมัติ (One-command Deploy) สำหรับ Build และรัน Production
├── .env.backend                       # ตัวแปรสภาพแวดล้อมสำหรับ Backend Production
├── .env.frontend                      # ตัวแปรสภาพแวดล้อมสำหรับ Frontend Production (พร้อม BASE_PATH)
├── Dockerfile.api                     # Multi-stage Dockerfile สำหรับ Backend API (Context: .)
├── Dockerfile.web                     # Multi-stage Dockerfile สำหรับ Frontend Next.js (Context: .)
├── .dockerignore                      # ป้องกัน secrets, node_modules และ build files เข้า Image
├── schema.sql                         # DDL Schema โครงสร้างระบบหลัก (สร้าง DB, Role, 58 ตาราง, สิทธิ์, Super Admin)
├── data.sql                           # ข้อมูลเริ่มต้นระบบหลัก (รันหลัง schema.sql เพื่อนำเข้าข้อมูลบุคลากร และข้อมูลย้อนหลัง)
├── backend/                           # โฟลเดอร์บริการ Backend API
│   ├── .env.example                   # แม่แบบตัวแปรสภาพแวดล้อม Backend
│   ├── prisma/
│   │   ├── schema.prisma              # Prisma Data Model (PostgreSQL 16)
│   │   └── migrations/                # ประวัติ Database Migrations ทั้งหมด
│   ├── src/
│   │   ├── config/                    # ตัวแปรสภาพแวดล้อมและการตั้งค่าระบบ
│   │   ├── db/                        # Prisma Client & Connection Pool
│   │   ├── middleware/                # Auth, Role Guard, Error Handler, Cookie Parser
│   │   ├── routes/                    # API Endpoints (auth, dashboard, kpi, ip, service, etc.)
│   │   └── index.ts                   # Express Application Entry Point
│   ├── scripts/                       # สคริปต์สำรองข้อมูล, นำเข้าข้อมูล, Seed KPI
│   └── package.json                   # Dependencies (Node 22, Express 5, Prisma 6)
├── warehouse_dashboard/               # โฟลเดอร์บริการ Frontend Dashboard
│   ├── .env.example                   # แม่แบบตัวแปรสภาพแวดล้อม Frontend
│   ├── next.config.ts                 # Next.js Standalone Configuration & Base Path Resolver
│   ├── public/                        # Static assets, icons, fonts
│   ├── src/
│   │   ├── app/                       # Next.js App Router (Dashboard pages, Auth callback, API)
│   │   ├── components/                # Reusable UI components & Chart widgets
│   │   ├── config/                    # KPI Config, Navigation, Constants
│   │   └── lib/                       # API Client, Pastel Themes, Auth Helpers, KPI Engine
│   └── package.json                   # Dependencies (Next.js 16, React 19, Tailwind)
└── README.md                          # เอกสารแนะนำการติดตั้งและรันระบบ
```

> **หมายเหตุเรื่องไฟล์ `.env`**:
> โปรเจกต์รองรับทั้งการใช้ `.env.backend` และ `.env.frontend` ที่โฟลเดอร์ Root สำหรับการรันผ่านสคริปต์ `deploy.sh` หรือแยกไฟล์ไว้ใน `backend/.env` และ `warehouse_dashboard/.env` ตามความสะดวก โดยไฟล์ `.env` ทั้งหมดถูกระบุไว้ใน `.dockerignore` จึงไม่ติดเข้าไปใน Docker Image และส่งค่าตอน Runtime ผ่าน `--env-file` แทน

---

## 2. ข้อมูลสำคัญสำหรับการ Deploy (Deployment Specification)

- **ชนิดฐานข้อมูล (Database)**: `Standalone / Native PostgreSQL 16 (Host Service)`
- **ชื่อฐานข้อมูล (Database Name)**: `ku_warehouse`
- **พอร์ตการทำงาน (Published Ports)**:
  - Frontend Web: `3000` (รองรับการตั้งค่า `BASE_PATH`)
  - Backend API: `8000`
  - Database: `5432` (ทำงานบน Host OS)
- **โดเมนและเส้นทาง Production จริง**: `https://sac.eng.kps.ku.ac.th/research_and_inovation/`
  - `PUBLIC_ORIGIN`: `https://sac.eng.kps.ku.ac.th`
  - `BASE_PATH`: `/research_and_inovation`
- **Git Branch ที่ใช้ Deploy**: `main`
- **การเชิญ Collaborator เข้า Git**: `misterkantapat@gmail.com` | `kantp428`

---

## 3. ขั้นตอนการเตรียมระบบและการรัน (Deployment Steps)

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล Standalone PostgreSQL (Native OS Service)

ฐานข้อมูลทำงานเป็น Native Service บน Server ไม่ต้องรันผ่าน Docker

#### 1.1 รันคำสั่งนำเข้า Schema และนำเข้าข้อมูลระบบ (รัน `schema.sql` ก่อน แล้วตามด้วย `data.sql`):
```bash
# --- กรณีที่ 1: เครื่อง Linux Server (รันด้วยสิทธิ์ postgres ประจำเครื่อง) ---
# ขั้นตอนที่ 1.1.1: สร้างฐานข้อมูล ku_warehouse, โครงสร้าง Schema, Application Roles, กำหนดสิทธิ์ และ Super Admin
sudo -u postgres psql -f schema.sql

# ขั้นตอนที่ 1.1.2: นำเข้าข้อมูลระบบหลัก (บุคลากร, โครงการวิจัย, ทรัพย์สินทางปัญญา, บริการวิชาการ, ผลงานตีพิมพ์)
sudo -u postgres psql -d ku_warehouse -f data.sql

# --- กรณีที่ 2: เครื่อง Windows Server หรือระบุ User/Host โดยตรง ---
# ขั้นตอนที่ 1.1.1: สร้างฐานข้อมูล และโครงสร้าง Schema
psql -h localhost -U postgres -f schema.sql

# ขั้นตอนที่ 1.1.2: นำเข้าข้อมูลระบบหลัก
psql -h localhost -U postgres -d ku_warehouse -f data.sql
```
*(สคริปต์ `schema.sql` จะสร้างฐานข้อมูล `ku_warehouse`, เชื่อมต่ออัตโนมัติ, สร้าง Application Roles `ku_app`, `ku_admin`, `ku_owner`, สร้าง 58 ตาราง, กำหนดสิทธิ์ครบทุก Schema และสร้าง Super Admin ทั้ง 4 บัญชี (`admin`, `superadmin`, `b0123456789`, `b6520503525`) พร้อมรหัสผ่านเริ่มต้น `Admin@1234` และ OTP `123456` ให้อัตโนมัติ จากนั้นรัน `data.sql` เพื่อนำเข้าข้อมูลหลักทั้งหมดเข้าสู่ระบบ)*

#### 1.2 ตรวจสอบการตั้งค่าให้ Container เชื่อมต่อเข้ามาได้:
- ในไฟล์ `postgresql.conf`: ตั้งค่า `listen_addresses = '*'`
- ในไฟล์ `pg_hba.conf`: ตรวจสอบว่าอนุญาตให้เชื่อมต่อเข้ามายัง `ku_warehouse` ได้ เช่น:
  ```text
  host    ku_warehouse    all    0.0.0.0/0    scram-sha-256
  ```
- สั่ง Reload / Restart PostgreSQL Service 1 ครั้ง

---

### วิธีที่ 1 (แนะนำ): Deploy อัตโนมัติด้วยคำสั่งเดียวผ่าน `deploy.sh`

สำหรับสภาพแวดล้อม Production (เช่น `sac.eng.kps.ku.ac.th`) มีสคริปต์ `deploy.sh` ที่รวบรวมขั้นตอน Build, สร้าง Network และรัน Container ทั้ง Frontend & Backend ให้โดยอัตโนมัติ:

1. **เตรียมไฟล์ Environment**: ตรวจสอบค่าใน `.env.backend` และ `.env.frontend` ที่โฟลเดอร์ Root ให้ถูกต้อง
2. **รันคำสั่ง Deploy**:
   ```bash
   bash deploy.sh
   ```
   *สคริปต์จะทำการ:*
   - Build Image `ku_warehouse_backend:latest`
   - Build Image `ku_warehouse_frontend:latest` พร้อมฝัง `BASE_PATH=/research_and_inovation`
   - สร้าง Docker Network `ku_warehouse_net`
   - รัน Backend Container (Port 8000) พร้อมเชื่อมต่อ Host Database ด้วย `--add-host=host.docker.internal:host-gateway`
   - รัน Frontend Container (Port 3000)

---

### วิธีที่ 2: ขั้นตอนการ Build และ Deploy แบบแยกคำสั่ง (Manual Step-by-Step)

#### ขั้นตอนที่ 2.1: สร้าง Docker Network สำหรับ Web & API Containers
```bash
docker network create ku_warehouse_net
```

#### ขั้นตอนที่ 2.2: Build และรัน Backend API Service (`Dockerfile.api`)

> **การเชื่อมต่อไปยัง Standalone DB**: ใช้แฟล็ก `--add-host=host.docker.internal:host-gateway` เพื่อให้ Container สามารถเชื่อมต่อกับ PostgreSQL ที่รันอยู่บน Host OS ได้อย่างสมบูรณ์ (หาก Database อยู่คนละเครื่อง Server ให้ระบุ IP ของเครื่อง Database แทน `host.docker.internal`)

**Build Backend Docker Image:**
```bash
docker build -f Dockerfile.api -t ku_warehouse_backend:latest .
```

**รัน Database Migration (กรณีต้องการอัปเดต Prisma Schema):**
```bash
docker run --rm \
  --network ku_warehouse_net \
  --add-host=host.docker.internal:host-gateway \
  -e DATABASE_URL="postgresql://ku_app:ku_app_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
  -e DIRECT_URL="postgresql://ku_owner:ku_owner_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
  ku_warehouse_backend:latest \
  npx prisma migrate deploy
```

**รัน Backend API Container:**
```bash
# สร้าง Named Volume สำหรับเก็บไฟล์อัปโหลด
docker volume create ku-warehouse-uploads

docker run -d \
  --name ku_warehouse_backend \
  --network ku_warehouse_net \
  --network-alias backend \
  --network-alias ku_warehouse_backend \
  --add-host=host.docker.internal:host-gateway \
  --restart unless-stopped \
  -p 8000:8000 \
  -v ku-warehouse-uploads:/app/uploads \
  --env-file .env.backend \
  ku_warehouse_backend:latest
```

#### ขั้นตอนที่ 2.3: Build และรัน Frontend Web Service (`Dockerfile.web`)

> **หมายเหตุเรื่อง API Path และ Base Path**:
> - Frontend เรียก API ผ่าน Relative Path `/api/v1` (Same-Origin) โดย Next.js จะส่งต่อ (Rewrites) ไปยัง Backend ตามค่า `BACKEND_URL` ตอน Runtime โดยอัตโนมัติ ทำให้**ไม่ต้อง Rebuild Image ใหม่เมื่อเปลี่ยนโดเมนหรือ IP**
> - หากต้องการใช้งาน Base Path เช่น `/research_and_inovation` ให้ระบุ `--build-arg BASE_PATH="/research_and_inovation"` และตั้งใน `.env.frontend`

**Build Frontend Docker Image:**
```bash
docker build -f Dockerfile.web \
  --build-arg BASE_PATH="/research_and_inovation" \
  --build-arg NEXT_PUBLIC_BASE_PATH="/research_and_inovation" \
  --build-arg NEXT_PUBLIC_API_URL="/api/v1" \
  --build-arg BACKEND_URL="http://backend:8000" \
  -t ku_warehouse_frontend:latest .
```

**รัน Frontend Container:**
```bash
docker run -d \
  --name ku_warehouse_frontend \
  --network ku_warehouse_net \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.frontend \
  ku_warehouse_frontend:latest
```

---

### ข้อกำหนดสำคัญสำหรับไฟล์ Environment (.env)

- **`PUBLIC_ORIGIN`**: ในโหมด `production` ต้องขึ้นต้นด้วย `https://` เช่น `https://sac.eng.kps.ku.ac.th`
- **`BASE_PATH` & `NEXT_PUBLIC_BASE_PATH`**: หากทำงานใต้ Subpath ให้กำหนดให้ตรงกัน เช่น `/research_and_inovation` (หากรันที่ Root Path ให้เว้นว่าง)
- **`CORS_ORIGIN`**: ระบุโดเมนที่อนุญาต เช่น `https://sac.eng.kps.ku.ac.th,http://localhost:3000`
- **`BACKEND_URL`**: ภายใน Docker Network ให้ชี้ไปที่ `http://backend:8000` (หรือ `http://ku_warehouse_backend:8000`)
- **`AUTH_SESSION_SECRET` & `JWT_COOKIE_SECRET`**: กำหนดคีย์ลับความยาวอย่างน้อย 32 ตัวอักษร สำหรับการเข้ารหัสและตรวจสอบ Session Cookie (HMAC Verification)

---

## 4. ตรวจสอบสถานะการทำงาน (Health Checks & Verification)

- **Backend Healthcheck**:
  ```bash
  curl -i http://localhost:8000/api/v1/health
  # ผลลัพธ์: HTTP/1.1 200 OK {"status":"ok","service":"ku-warehouse-backend","database":"connected",...}
  ```
- **Frontend Healthcheck**:
  ```bash
  curl -i http://localhost:3000/api/health
  # ผลลัพธ์: HTTP/1.1 200 OK
  ```
- **การเข้าใช้งานผ่านเบราว์เซอร์**:
  - URL (Production): `https://sac.eng.kps.ku.ac.th/research_and_inovation`
  - URL (Localhost): `http://localhost:3000/research_and_inovation` (หรือ `http://localhost:3000`)
  - **บัญชีผู้ดูแลระบบ (Super Admin)**:
    - **ชื่อผู้ใช้งาน (Username)**: `b0123456789`
    - **รหัสผ่าน (Password)**: `Admin@1234`
    - **รหัส OTP (Step 2)**: `123456`

---

## 5. การหยุดและลบ Container
```bash
docker rm -f ku_warehouse_frontend ku_warehouse_backend
docker network rm ku_warehouse_net
docker volume rm ku-warehouse-uploads
```
