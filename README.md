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
├── Dockerfile.api                     # Multi-stage Dockerfile สำหรับ Backend API (Context: .)
├── Dockerfile.web                     # Multi-stage Dockerfile สำหรับ Frontend Next.js (Context: .)
├── .dockerignore                      # ป้องกัน secrets, node_modules และ build files เข้า Image
├── schema.sql                         # DDL Schema เริ่มต้น (สร้าง DB, Role, 58 ตาราง, สิทธิ์, Super Admin)
├── ku_warehouse_dump.sql              # Dump ข้อมูลเต็ม (Schema + ข้อมูลทั้งหมดของระบบ)
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

- **ชนิดฐานข้อมูล (Database)**: `Standalone / Native PostgreSQL 16 (Host Service)`
- **ชื่อฐานข้อมูล (Database Name)**: `ku_warehouse`
- **พอร์ตการทำงาน (Published Ports)**:
  - Frontend Web: `3000` (รองรับการตั้งค่า `BASE_PATH`)
  - Backend API: `8000`
  - Database: `5432` (ทำงานบน Host OS)
- **Git Branch ที่ใช้ Deploy**: `main`
- **การเชิญ Collaborator เข้า Git**: `misterkantapat@gmail.com` | `kantp428`

---

## 3. ขั้นตอนการเตรียมระบบและการรัน (Deployment Steps)

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล Standalone PostgreSQL (Native OS Service)

ฐานข้อมูลทำงานเป็น Native Service บน Server ไม่ต้องรันผ่าน Docker

#### 1.1 รันคำสั่งนำเข้า Schema และสร้างฐานข้อมูลผ่าน Terminal:
```bash
# กรณีที่ 1: เครื่อง Linux Server (รันด้วยสิทธิ์ postgres ประจำเครื่อง)
sudo -u postgres psql -f schema.sql

# กรณีที่ 2: เครื่อง Windows Server หรือระบุ User/Host โดยตรง
psql -h localhost -U postgres -f schema.sql

# หมายเหตุ: หากต้องการนำเข้าโครงสร้างพร้อมข้อมูลจริงทั้งหมด ให้เปลี่ยนเป็นไฟล์:
# psql -h localhost -U postgres -f ku_warehouse_dump.sql
```
*(สคริปต์จะสร้างฐานข้อมูล `ku_warehouse`, เชื่อมต่ออัตโนมัติ, สร้าง Application Roles `ku_app`, `ku_admin`, `ku_owner`, สร้าง 58 ตาราง, กำหนดสิทธิ์ และสร้าง Super Admin `b0123456789` ให้อัตโนมัติ)*

#### 1.2 ตรวจสอบการตั้งค่าให้ Container เชื่อมต่อเข้ามาได้:
- ในไฟล์ `postgresql.conf`: ตั้งค่า `listen_addresses = '*'`
- ในไฟล์ `pg_hba.conf`: ตรวจสอบว่าอนุญาตให้เชื่อมต่อเข้ามายัง `ku_warehouse` ได้ เช่น:
  ```text
  host    ku_warehouse    all    0.0.0.0/0    scram-sha-256
  ```
- สั่ง Reload / Restart PostgreSQL Service 1 ครั้ง

---

### ขั้นตอนที่ 2: สร้าง Docker Network สำหรับ Web & API Containers
```bash
docker network create ku-warehouse-net
```

---

### ขั้นตอนที่ 3: Build และรัน Backend API Service (`Dockerfile.api`)

> **การเชื่อมต่อไปยัง Standalone DB**: ใช้แฟล็ก `--add-host=host.docker.internal:host-gateway` เพื่อให้ Container สามารถเชื่อมต่อกับ PostgreSQL ที่รันอยู่บน Host OS ได้อย่างสมบูรณ์ (หาก Database อยู่คนละเครื่อง Server ให้ระบุ IP ของเครื่อง Database แทน `host.docker.internal`)

#### 3.1 Build Backend Docker Image:
```bash
docker build -f Dockerfile.api -t ku-warehouse-backend:latest .
```

#### 3.2 รัน Database Migration:
```bash
docker run --rm \
  --network ku-warehouse-net \
  --add-host=host.docker.internal:host-gateway \
  -e DATABASE_URL="postgresql://ku_app:ku_app_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
  -e DIRECT_URL="postgresql://ku_owner:ku_owner_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
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
  --add-host=host.docker.internal:host-gateway \
  --restart unless-stopped \
  -p 8000:8000 \
  -v ku-warehouse-uploads:/app/uploads \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ku_app:ku_app_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
  -e DIRECT_URL="postgresql://ku_owner:ku_owner_secret_2026@host.docker.internal:5432/ku_warehouse?schema=public" \
  -e AUTH_SESSION_SECRET="a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a" \
  -e CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000" \
  ku-warehouse-backend:latest
```

---

### ขั้นตอนที่ 4: Build และรัน Frontend Web Service (`Dockerfile.web`)

> **หมายเหตุเรื่อง Base Path**: หากต้องการใช้งาน Base Path เช่น `/warehouse` ให้ระบุ `--build-arg BASE_PATH="/warehouse"` และ `-e BASE_PATH="/warehouse"` หากใช้งานที่ root path ให้ปล่อยว่างไว้

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
  - URL: `http://localhost:3000`
  - **บัญชีผู้ดูแลระบบ (Super Admin)**:
    - **ชื่อผู้ใช้งาน (Username)**: `b0123456789`
    - **รหัสผ่าน (Password)**: `Admin@1234`
    - **รหัส OTP (Step 2)**: `123456`

---

## 5. การหยุดและลบ Container
```bash
docker rm -f ku_warehouse_frontend ku_warehouse_backend
docker network rm ku-warehouse-net
docker volume rm ku-warehouse-uploads
```
