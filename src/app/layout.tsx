import type { Metadata } from "next";
import { Sarabun, Inter } from "next/font/google";
import { FaChartLine } from "react-icons/fa"; // ใช้ react-icons แทน FontAwesome เดิม
import "./globals.css";

// ดึงฟอนต์มาใช้งาน
const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ตั้งค่า Meta Tags ต่างๆ
export const metadata: Metadata = {
  title: "Dashboard สรุปผลงาน คณะวิศวกรรมศาสตร์ กำแพงแสน | Data Warehouse",
  description: "Dashboard สรุปผลงานวิจัยและวิชาการ คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์ ม.ค.-พ.ค. 2569",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* เพิ่มลิงก์ Font Awesome สำหรับไอคอนต่างๆ (หลอดไฟ, กราฟ, หนังสือ ฯลฯ) ในหน้าเว็บ */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body className={`${sarabun.variable} ${inter.variable}`}>
        
        {/* ส่วน Header ดึงมาจากโค้ด HTML ของคุณ */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <FaChartLine />
              </div>
              <div>
                <h1>Dashboard สรุปผลงานวิจัยและนวัตกรรม</h1>
                <div className="header-sub">
                  คณะวิศวกรรมศาสตร์ กำแพงแสน • มหาวิทยาลัยเกษตรศาสตร์
                </div>
              </div>
            </div>
            <div className="header-badge">
              {/* เปลี่ยน <i> เป็นอิโมจิหรือข้ามไปก่อนได้ เพราะเดี๋ยวไอคอนจะใช้ react-icons */}
              📅 ม.ค. - พ.ค. 2569
            </div>
          </div>
        </header>

        {/* ตรงนี้คือเนื้อหาของแต่ละหน้าที่จะมาสอดไส้ตรงกลาง */}
        {children}

        {/* ส่วน Footer ดึงมาจากโค้ด HTML ของคุณ */}
        <footer className="footer">
          <strong>คณะวิศวกรรมศาสตร์ กำแพงแสน</strong> • มหาวิทยาลัยเกษตรศาสตร์ |
          Dashboard สำหรับวิชา Data Warehouse | ข้อมูล ม.ค. - พ.ค. 2569
        </footer>

      </body>
    </html>
  );
}