# ระบบคลังข้อมูลและแดชบอร์ดบริหารจัดการข้อมูลหน่วยวิจัยและนวัตกรรม
## คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์
**(KU Engineering Kamphaeng Saen Data Warehouse & Executive Dashboard)**

---

## 1. ภาพรวมโครงสร้างของโปรเจกต์ (Project Architecture & Structure)

โปรเจกต์นี้ได้รับการพัฒนาภายใต้สถาปัตยกรรมแยกส่วน (Decoupled Microservice Architecture) โดยแบ่งออกเป็น 3 บริการหลัก:
1. **Frontend Web Application (`warehouse_dashboard`)**: พัฒนาด้วย Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS และ Chart.js สำหรับการแสดงผลแดชบอร์ด รายงานยุทธศาสตร์ และระบบบริหารจัดการข้อมูล
2. **Backend API Service (`backend`)**: พัฒนาด้วย Node.js 22, Express.js 5, TypeScript และ Prisma ORM ให้บริการ RESTful API, ระบบตรวจสอบสิทธิ์, การประเมินผลงานอัตโนมัติ (SDGs/TRL/Quartile) และ Strategic KPI Engine
3. **Database (`PostgreSQL 16`)**: จัดเก็บข้อมูลพันธกิจ 5 ด้าน (วิจัย, บริการวิชาการ, พัฒนาวิชาการ, ตีพิมพ์, ทรัพย์สินทางปัญญา), ตัวชี้วัดเชิงยุทธศาสตร์ 4 ระดับ และระบบผู้ใช้งาน

```
warehouse_dashboard/
├── Dockerfile.api                     # Multi-stage Dockerfile สำหรับ Backend API (Context: .)
├── Dockerfile.web                     # Multi-stage Dockerfile สำหรับ Frontend Next.js (Context: .)
├── .dockerignore                      # ป้องกัน secrets, node_modules และ build files เข้า Image
├── backend/                           # โฟลเดอร์บริการ Backend API
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

---

## 2. ข้อมูลสำคัญสำหรับการ Deploy (Deployment Specification)

- **ชนิดฐานข้อมูล (Database)**: `PostgreSQL 16`
- **ชื่อฐานข้อมูล (Database Name)**: `ku_warehouse`
- **พอร์ตการทำงาน (Published Ports)**:
  - Frontend Web: `3000` (รองรับการตั้งค่า `BASE_PATH`)
  - Backend API: `8000`
  - Database: `5432`
- **Git Branch ที่ใช้ Deploy**: `dashboard-and-backend` (หรือ `main`)
- **การเชิญ Collaborator เข้า Git**: เชิญ `misterkantapat@gmail.com` | `kantp428` เข้าร่วมโปรเจกต์บน GitHub เรียบร้อยแล้ว

---

## 3. ขั้นตอนการ Build และ Run ด้วย Pure Docker (ไม่ใช้ Docker Compose)

### ขั้นตอนที่ 1: สร้าง Docker Network ร่วมสำหรับทุก Container
```bash
docker network create ku-warehouse-net
```

---

### ขั้นตอนที่ 2: เริ่มต้น PostgreSQL Database Container
```bash
# สร้าง Named Volume สำหรับจัดเก็บข้อมูลแบบถาวร
docker volume create ku-warehouse-pgdata

# รัน PostgreSQL 16 Container
docker run -d \
  --name ku_warehouse_db \
  --network ku-warehouse-net \
  --restart unless-stopped \
  -e POSTGRES_DB=ku_warehouse \
  -e POSTGRES_USER=ku_owner \
  -e POSTGRES_PASSWORD=ku_owner_secret_2026 \
  -v ku-warehouse-pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

#### การนำเข้าข้อมูลเริ่มต้น (Restore Database Dump):
```bash
# กรณีรันคำสั่งจาก Root ไดเรกทอรีของโปรเจกต์:
docker exec -i ku_warehouse_db psql -U ku_owner -d ku_warehouse < deploy/ku_warehouse_dump.sql

# หรือกรณีวางไฟล์ dump ไว้ในไดเรกทอรีเดียวกัน:
docker exec -i ku_warehouse_db psql -U ku_owner -d ku_warehouse < ku_warehouse_dump.sql
```

---

### ขั้นตอนที่ 3: Build และรัน Backend API Service (`Dockerfile.api`)

#### 3.1 Build Backend Docker Image:
```bash
docker build -f Dockerfile.api -t ku-warehouse-backend:latest .
```

#### 3.2 รัน Database Migration (ปลอดภัย ไม่ reset หรือ seed ข้อมูลทับ):
```bash
docker run --rm \
  --network ku-warehouse-net \
  -e DATABASE_URL="postgresql://ku_app:ku_app_secret_2026@ku_warehouse_db:5432/ku_warehouse?schema=public" \
  -e DIRECT_URL="postgresql://ku_owner:ku_owner_secret_2026@ku_warehouse_db:5432/ku_warehouse?schema=public" \
  ku-warehouse-backend:latest \
  npx prisma migrate deploy
```

#### 3.3 รัน Backend API Container:
```bash
# สร้าง Named Volume สำหรับเก็บไฟล์อัปโหลด
docker volume create ku-warehouse-uploads

docker run -d \
  --name ku_warehouse_backend \
  --network ku-warehouse-net \
  --network-alias backend \
  --network-alias ku_warehouse_backend \
  --restart unless-stopped \
  -p 8000:8000 \
  -v ku-warehouse-uploads:/app/uploads \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ku_app:ku_app_secret_2026@ku_warehouse_db:5432/ku_warehouse?schema=public" \
  -e DIRECT_URL="postgresql://ku_owner:ku_owner_secret_2026@ku_warehouse_db:5432/ku_warehouse?schema=public" \
  -e AUTH_SESSION_SECRET="a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a" \
  -e CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000" \
  ku-warehouse-backend:latest
```

---

### ขั้นตอนที่ 4: Build และรัน Frontend Web Service (`Dockerfile.web`)

> **หมายเหตุเรื่อง Base Path**: หากผู้ประเมินหรือผู้ติดตั้งต้องการใช้งาน Base Path เช่น `/warehouse` ให้ระบุ `--build-arg BASE_PATH="/warehouse"` และ `-e BASE_PATH="/warehouse"` หากใช้งานที่ root path ให้ปล่อยว่างไว้

#### 4.1 Build Frontend Docker Image:
```bash
docker build -f Dockerfile.web \
  --build-arg BASE_PATH="" \
  --build-arg NEXT_PUBLIC_BASE_PATH="" \
  --build-arg NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1" \
  --build-arg BACKEND_URL="http://ku_warehouse_backend:8000" \
  -t ku-warehouse-frontend:latest .
```

#### 4.2 รัน Frontend Container:
```bash
docker run -d \
  --name ku_warehouse_frontend \
  --network ku-warehouse-net \
  --restart unless-stopped \
  -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e PUBLIC_ORIGIN="http://localhost:3000" \
  -e BASE_PATH="" \
  -e NEXT_PUBLIC_BASE_PATH="" \
  -e BACKEND_URL="http://ku_warehouse_backend:8000" \
  -e JWT_COOKIE_SECRET="a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a" \
  -e AUTH_SESSION_SECRET="a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a" \
  ku-warehouse-frontend:latest
```

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
  - URL: `http://localhost:3000` (หรือ `http://localhost:3000/{BASE_PATH}`)
  - **บัญชีผู้ดูแลระบบสำหรับทดสอบ (Evaluation & Test Account)**:
    - **ชื่อผู้ใช้งาน (Username)**: `b0123456789`
    - **รหัสผ่าน (Password)**: `Admin@1234`
    - **รหัส OTP (Step 2)**: `123456`
    - *ขั้นตอนการเข้าสู่ระบบ*: เปิดหน้าแรก `http://localhost:3000` $\rightarrow$ กรอก Username/Password ในขั้นตอนที่ 1 $\rightarrow$ กรอก OTP ในขั้นตอนที่ 2 เพื่อเข้าสู่ระบบในฐานะผู้ดูแลระบบ (Super Admin) และเข้าถึงฟังก์ชันทั้งหมดได้อย่างสมบูรณ์

---

## 5. การหยุดและลบ Container ที่สร้างขึ้น
```bash
docker rm -f ku_warehouse_frontend ku_warehouse_backend ku_warehouse_db
docker network rm ku-warehouse-net
docker volume rm ku-warehouse-pgdata ku-warehouse-uploads
```
