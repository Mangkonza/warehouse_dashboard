# วิธีการรันระบบ (Quick Start Guide)

## สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ติดตั้งและเปิดใช้งานอยู่)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18+ หรือ 20+)

---

## ขั้นตอนที่ 1: เปิดใช้งาน Database ด้วย Docker
1. คัดลอกไฟล์ Environment Variables ที่ root ของโปรเจกต์ (หากยังไม่มี):
   ```bash
   cp .env.example .env
   ```

2. เปิดการทำงานของ PostgreSQL Database Container:
   ```bash
   docker compose up -d
   ```

---

## ขั้นตอนที่ 2: รัน Backend API
เปิด Terminal แรก แล้วทำตามขั้นตอน:

1. เข้าโฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```

2. คัดลอกไฟล์ Environment Variables (หากยังไม่มี):
   ```bash
   cp .env.example .env
   ```

3. ติดตั้ง Dependencies และรัน Prisma Migration:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

4. เริ่มต้นเซิร์ฟเวอร์ Backend:
   ```bash
   npm run dev
   ```
   > Backend API จะทำงานที่: `http://localhost:8000`

---

## ขั้นตอนที่ 3: รัน Frontend Dashboard
เปิด Terminal อีกหน้าต่าง แล้วทำตามขั้นตอน:

1. เข้าโฟลเดอร์ `warehouse_dashboard`:
   ```bash
   cd warehouse_dashboard
   ```

2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

3. เริ่มต้นเซิร์ฟเวอร์ Frontend:
   ```bash
   npm run dev
   ```
   > เข้าใช้งานหน้าเว็บผ่านเบราว์เซอร์ที่: `http://localhost:3000`
