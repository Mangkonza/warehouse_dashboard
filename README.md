# วิธีการรันระบบ (Quick Start Guide)

## สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ติดตั้งและเปิดใช้งานอยู่)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18+ หรือ 20+)

---

## ขั้นตอนที่ 1: Build และเปิดใช้งาน Database Container ใน Docker
เริ่มต้นด้วยการรันฐานข้อมูล PostgreSQL พร้อมโหลดโครงสร้างและข้อมูลตั้งต้นอัตโนมัติ:

```bash
docker compose up -d
```

> **คำสั่งตรวจสอบสถานะ Container:**
> ```bash
> docker ps
> ```
> จะเห็น Container `ku_warehouse_db` กำลังทำงานที่พอร์ต `5432`

---

## ขั้นตอนที่ 2: รัน Backend API
เปิด Terminal แรก แล้วทำตามขั้นตอนดังนี้:

1. เข้าไปยังโฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. เริ่มต้นรันเซิร์ฟเวอร์ Backend (ไฟล์ `.env` มีการตั้งค่าพร้อมใช้งานอยู่แล้ว):
   ```bash
   npm run dev
   ```
   > Backend API จะทำงานที่: `http://localhost:8000`

---

## ขั้นตอนที่ 3: รัน Frontend Dashboard
เปิด Terminal อีกหน้าต่าง แล้วทำตามขั้นตอนดังนี้:

1. เข้าไปยังโฟลเดอร์ `warehouse_dashboard`:
   ```bash
   cd warehouse_dashboard
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. เริ่มต้นรันเซิร์ฟเวอร์ Frontend (ไฟล์ `.env` และ `.env.local` มีการตั้งค่าพร้อมใช้งานอยู่แล้ว):
   ```bash
   npm run dev
   ```
   > เข้าใช้งานหน้าเว็บผ่านเบราว์เซอร์ที่: `http://localhost:3000`
