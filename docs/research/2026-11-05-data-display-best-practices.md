# แนวปฏิบัติการแสดงผลข้อมูลบนแดชบอร์ด: รูปแบบ วิธี และระดับรายละเอียด

วันที่ค้นคว้า: 5 พฤศจิกายน 2026

เอกสารนี้ต่อจาก [แนวทางเลือกรูปแบบกราฟสำหรับ Warehouse Dashboard](./2026-11-05-dashboard-chart-best-practices.md) ซึ่งว่าด้วยการเลือกชนิดกราฟโดยเฉพาะ เอกสารนี้เน้นคำถามที่ต่างออกไป: **ข้อมูลควรถูกแสดงด้วยสื่อใด (สรุป/กราฟ/ตาราง/ทั้งคู่), ควรอยู่ในลำดับชั้นไหน, และควรจัดรูปแบบอย่างไรจึงอ่านง่ายและเข้าถึงได้**

## 1. สรุปสำหรับการออกแบบ

1. **เริ่มจากงานที่ผู้ใช้ต้องทำ ไม่ใช่จากชนิดข้อมูล** — ถ้าคำถามคือ "ค่าไหนมากกว่า" กราฟแท่ง/ดอทพล็อตทำงานได้ดีที่สุด; ถ้าคำถามคือ "ค่าที่แน่นอนคือเท่าไร" ตารางคือคำตอบ; ถ้าต้องการทั้งภาพรวมและค่าตรวจสอบ ให้กราฟเป็นชั้นหลักและตารางเป็นชั้นรายละเอียด [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/), [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
2. **ตารางไม่ใช่ตัวเลือกที่ด้อยกว่ากราฟ** — ตารางได้เปรียบเรื่องการรองรับข้อมูลหลายตัวแปร การเปรียบเทียบค่าที่อยู่ใกล้กัน และการอ่านค่าตรง ๆ ส่วนกราฟได้เปรียบเรื่องการเห็นรูปแบบ แนวโน้ม และความสัมพันธ์ [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/), [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
3. **แดชบอร์ดควรเรียงจากภาพรวมไปรายละเอียด** — ภาพรวมก่อน, ซูม/กรอง, แล้วจึงเปิดรายละเอียดเมื่อผู้ใช้ขอ (overview first, zoom and filter, details-on-demand) [Shneiderman, 1996](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf)
4. **ตารางเต็มไม่ควรแสดงซ้ำกับกราฟตลอดเวลา** — ให้เป็น "ชั้นรายละเอียด" ที่ยุบไว้หรือเปิดเมื่อต้องการ และทำหน้าที่เป็นคำอธิบายข้อมูลแบบข้อความ/accessible equivalent ของกราฟด้วย [W3C WCAG 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)
5. **ตัวเลขต้องอ่านง่ายกว่ารูปแบบ** — ชิดขวา, ทศนิยมเท่ากันในคอลัมน์, คั่นหลักพัน, มีหน่วยชัดเจน, และปัดเศษเมื่อไม่จำเป็นต้องใช้ค่าละเอียด [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/), [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)
6. **การเข้าถึงเป็นเงื่อนไขของการออกแบบ ไม่ใช่ของแถม** — กราฟที่วาดบน canvas ต้องมีข้อความทดแทน; ตารางต้องมี caption/header ที่ถูกต้อง; สีต้องไม่ใช่ช่องทางเดียวในการสื่อความหมาย [W3C WCAG 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [W3C WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [W3C: Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/)

## 2. เลือกสื่อจากคำถาม ไม่ใช่จากปริมาณข้อมูล

Government Analysis Function สรุปความต่างไว้ชัดเจน:

- **ตาราง** เหมาะเมื่อผู้ใช้ต้อง **เปรียบเทียบค่า**, ดูค่าที่เป็นเปอร์เซ็นต์/ดัชนี, ดูสถิติสรุป เช่น ค่าเฉลี่ย/ยอดรวม, หรือเมื่อต้องแสดงค่าที่มีขนาดต่างกันมากในจอเดียว
- **กราฟ** เหมาะเมื่อต้องแสดง **รูปแบบ แนวโน้ม และความสัมพันธ์**
- **Reference table** (ตารางข้อมูลขนาดใหญ่เพื่อนำไปใช้ต่อ) ควรอยู่ในรูปแบบ spreadsheet ที่เข้าถึงได้ ไม่ใช่ตาราง HTML ขนาดยักษ์ [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)

GOV.UK เสริมว่าโดยปกติบนเดสก์ท็อปควรเห็นได้ประมาณ 4–5 คอลัมน์และ 10 แถวโดยไม่ต้องเลื่อน และถ้าโตกว่านั้นควรแยกตารางหรือเปลี่ยนเป็นไฟล์ spreadsheet [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)

### ตารางตัดสินใจ

| คำถาม/งานของผู้ใช้ | สรุป (summary) | กราฟ | ตาราง | ข้อเสนอ |
|---|---|---|---|---|
| ภาพรวม "ปีนี้เป็นอย่างไร" | ✅ | ✅ | — | KPI cards + กราฟหลักหนึ่งกราฟ |
| "หมวดไหนมากที่สุด/เปลี่ยนมากที่สุด" | — | ✅ | — | แท่งแนวนอนเรียงตามค่า/ผลต่าง |
| "ค่าที่แน่นอนของหมวดนี้คือเท่าไร" | — | — | ✅ | ตารางหรือ tooltip ที่เข้าถึงได้ |
| "เปรียบเทียบหลายค่าพร้อมกัน" | — | จำกัด | ✅ | ตาราง; กราฟช่วยเห็นรูปแบบ |
| "ค่าต่างกันมากจนกราฟอ่านยาก" | — | ❌ | ✅ | ตาราง หรือกราฟแยกแผง/สเกลที่เหมาะสม |
| "ต้องตรวจสอบ/audit/ส่งออก" | — | — | ✅ | ตารางเต็ม + CSV/print |
| "ต้องรองรับ screen reader" | ✅ | ต้องมีข้อความทดแทน | ✅ | กราฟ + ตาราง/คำอธิบาย |
| "ภาพรวมแล้วเจาะลึก" | ✅ | ✅ | ✅ | สรุป → กราฟ → ตารางแบบยุบ |
| "จอเล็ก" | ✅ | ✅ | ✅ (แบบย่อ) | กราฟเต็มความกว้าง + ตารางแบบการ์ด/แถวกระชับ |

> หมายเหตุ: ตารางนี้เป็นการสังเคราะห์จากหลักของ AF, NN/g และ WCAG ไม่ใช่ตารางสำเร็จรูปจากแหล่งใดแหล่งหนึ่ง

## 3. ลำดับชั้นข้อมูล: ภาพรวม → รายละเอียด

### 3.1 หลัก "overview first"

Shneiderman (1996) เสนอ mantra ที่ยังใช้ได้จนถึงปัจจุบัน:

> "Overview first, zoom and filter, then details on demand."

ความหมายเชิงปฏิบัติสำหรับแดชบอร์ดนี้:

1. **ชั้นภาพรวม** — KPI สรุปจำนวนไม่มาก หรือกราฟหลักหนึ่งกราฟ ที่ตอบคำถาม "เกิดอะไรขึ้น" ได้ในไม่กี่วินาที
2. **ชั้นเจาะจง** — ตัวกรองปี/สังกัด/ตัวชี้วัด และกราฟที่เปลี่ยนตามตัวกรอง
3. **ชั้นรายละเอียด** — ตารางค่าจริง, รายการระดับระเบียน, คำอธิบายฐานต่ำ, แหล่งข้อมูล

### 3.2 Progressive disclosure

NN/g อธิบายว่า progressive disclosure คือการแสดงเฉพาะตัวเลือกสำคัญในชั้นแรก และเก็บส่วนที่ใช้ไม่บ่อยไว้ในชั้นที่สอง โดยมีเงื่อนไขสองข้อ:

- ต้องแบ่งให้ถูกว่า อะไรควรอยู่ชั้นแรก (สิ่งที่ผู้ใช้ต้องใช้บ่อย) และอะไรควรอยู่ชั้นสอง
- ต้องทำให้เห็นชัดว่าผู้ใช้จะไปชั้นถัดไปได้อย่างไร และป้ายต้องบอกล่วงหน้าว่าจะเจออะไร [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

NN/g ยังเตือนว่าการออกแบบที่ต้องเปิดมากกว่า 2 ชั้นมักใช้งานยาก เพราะผู้ใช้หลงทาง [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

### 3.3 ตารางเป็น "long description" ของกราฟได้

WCAG 1.1.1 กำหนดให้เนื้อหาที่ไม่ใช่ข้อความต้องมี text alternative ที่ทำหน้าที่เทียบเท่า สำหรับกราฟที่ซับซ้อน ตัวอย่างที่ W3C ให้คือ: มี label สั้น ๆ บอกว่ากราฟคืออะไร และมีคำอธิบายยาวที่สรุปข้อมูล/แนวโน้ม/นัยสำคัญ และ "where possible and practical, the actual data is provided in a table" [W3C WCAG 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)

Government Analysis Function ระบุทางเลือกของ text alternative สำหรับกราฟไว้ 2 แบบ:

- **ตารางของข้อมูลในกราฟ** — ใช้เมื่อคาดว่าผู้ใช้ที่มองเห็นจะอ่านค่าจากกราฟ
- **คำอธิบายข้อความของสารที่กราฟต้องการสื่อ** — ใช้เมื่อคาดว่าผู้ใช้จะได้ความเข้าใจภาพรวม
- ถ้าผู้ใช้ต้องได้ทั้งสองอย่าง ให้ให้ทั้งสองอย่าง [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)

ดังนั้น "ตารางที่ซ้ำกับกราฟ" ไม่ได้ไร้ประโยชน์โดยอัตโนมัติ — มันมีหน้าที่ต่างกัน: กราฟเพื่อการเปรียบเทียบเชิงภาพ, ตารางเพื่อค่าที่แน่นอนและการเข้าถึง สิ่งที่ควรลดคือ **การแสดงทั้งสองอย่างพร้อมกันในลำดับความสำคัญเท่ากัน** ไม่ใช่การลบตารางทิ้ง

### 3.4 ตารางควรอยู่ชั้นไหน

ข้อเสนอสำหรับแดชบอร์ดนี้:

| ชั้น | เนื้อหา | ค่าเริ่มต้น |
|---|---|---|
| 1. Glance | KPI cards: ปีฐาน, ปีเปรียบเทียบ, ผลต่าง | แสดงเสมอ |
| 2. Compare | กราฟแท่งแนวนอน + tooltip | แสดงเสมอ |
| 3. Verify | ตารางรายสังกัด + คำอธิบายฐานต่ำ | **ยุบไว้** เปิดเมื่อขอ |
| 4. Export | CSV/print ของตารางเต็ม | ปุ่มแยก |

## 4. ตาราง: เมื่อไรควรมี และควรมีกี่คอลัมน์/กี่แถว

### 4.1 เมื่อไรตารางเต็มมีความชอบธรรม

ตารางเต็มควรมีเมื่ออย่างน้อยหนึ่งข้อต่อไปนี้เป็นจริง:

- ผู้ใช้ต้อง **อ่านค่าที่แน่นอน** หรือนำตัวเลขไปใช้ต่อ
- ต้อง **ตรวจสอบย้อนกลับ/audit** ว่าตัวเลขมาจากไหน
- ต้องแสดง **ค่าที่มีขนาดต่างกันมาก** จนกราฟเดียวกันอ่านยาก
- ต้องแสดง **เปอร์เซ็นต์/ดัชนี/สถิติสรุป** หลายค่าพร้อมกัน
- ต้องเป็น **accessible equivalent** ของกราฟ
- ต้อง **ส่งออก/พิมพ์** เป็นรายงาน

ถ้าไม่มีข้อใดจริง และตารางเพียงทำซ้ำค่าที่กราฟแสดงอยู่แล้ว ตารางนั้นควรถูกยุบหรือย้ายไปหน้าถัดไป [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/), [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)

### 4.2 ขนาดตาราง

- GOV.UK แนะนำขนาดขั้นต่ำ 2 คอลัมน์ × 3 แถว (รวมหัวตาราง) และบนเดสก์ท็อปมักเห็นได้ 4–5 คอลัมน์ × 10 แถวโดยไม่ต้องเลื่อน
- ถ้าใหญ่กว่านั้น ให้แยกเป็นตารางย่อย หลายหน้า หรือดาวน์โหลดเป็น spreadsheet [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)
- AF แนะนำให้ใช้พื้นที่ว่าง/ความกว้างคอลัมน์ในการจัดกลุ่ม ไม่ใช้แถวว่างหรือคอลัมน์ว่าง เพราะทำให้ screen reader สับสน [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)

### 4.3 คอลัมน์

- คอลัมน์แรกควรเป็น **ตัวระบุที่มนุษย์อ่านได้** ไม่ใช่รหัสลึกลับ [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
- ลำดับคอลัมน์ควรสะท้อนความสำคัญ และคอลัมน์ที่เกี่ยวข้องกันควรอยู่ติดกัน [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
- ตารางสาธิต (demonstration table) ควรเล็กและเสริมข้อความ ไม่ใช่ reference table ขนาดใหญ่ [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- GOV.UK แนะนำให้ "คำนวณให้ผู้ใช้" เช่น ใส่ผลรวมหรือผลต่างไว้ท้ายคอลัมน์/แถว แทนที่จะให้ผู้ใช้ลบเอง [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)

### 4.4 ตัวเลข

- **ชิดขวา** ทั้งตัวเลขและหัวคอลัมน์ เพื่อให้หลักหน่วย/สิบ/ร้อยตรงกัน [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/), [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)
- **ทศนิยมเท่ากันภายในคอลัมน์เดียวกัน** [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- **คั่นหลักพันด้วย comma** และใส่ศูนย์นำหน้าค่าที่น้อยกว่าหนึ่ง เช่น 0.5 ไม่ใช่ .5 [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- **ระบุหน่วย** ในหัวคอลัมน์หรือชื่อตาราง [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- **ปัดเศษ** เมื่อความละเอียดสูงไม่ช่วยการตัดสินใจ แต่ระวังว่าผลรวมอาจไม่เท่ากับผลบวกของชิ้นส่วน [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- ใช้ **tabular numerals** (เช่น `font-variant-numeric: tabular-nums`) เพื่อให้ตัวเลขกว้างเท่ากันและเรียงเป็นแนว — โค้ดปัจจุบันใช้อยู่แล้วในหลายเซลล์

### 4.5 รูปแบบและความหนาแน่น

- ใช้เส้นตาราง/เส้นแบ่งแถวบาง ๆ, zebra striping และ hover highlight ช่วยให้ตาจับแถวได้ [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
- หลีกเลี่ยง shading ที่ไม่จำเป็น และถ้าใช้สีต้องไม่ใช้สีเป็นช่องทางเดียว [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/), [W3C WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- หลีกเลี่ยง gridline ที่เข้มหรือหนาเกินไป [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- ความหนาแน่นของแถวควรเลือกตามงาน: แบบกระชับเมื่อต้องเทียบหลายแถว, แบบสบายเมื่อต้องอ่านทีละแถว — Carbon มีตัวเลือก row size ให้ผู้ใช้ปรับ [Carbon Design System: Data table](https://carbondesignsystem.com/building-blocks/core/components/data-table)

### 4.6 การเรียง ลำดับ และการกรอง

- เรียงตามค่าที่สื่อความหมาย เช่น มากไปน้อย หรือผลต่างมากไปน้อย [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- ถ้ามีลำดับตามธรรมชาติ (เดือน, ปี, ขั้นสถานะ) ให้คงลำดับนั้น [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)
- ให้ผู้ใช้เรียง/กรองได้ และแสดงสถานะว่ากำลังดูข้อมูลที่ถูกกรองอยู่ [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
- ถ้ามีหลายแถว ให้แสดง top N ตามด้วย "แสดงทั้งหมด (N)" — วิธีนี้ลดความรกโดยไม่ตัดข้อมูล [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

### 4.7 มือถือ

- ควรออกแบบตารางให้ใช้ได้บนจอกว้างก่อน แล้วจึงปรับสำหรับจอเล็ก [NN/g: Mobile Tables](https://www.nngroup.com/articles/mobile-tables/)
- ถ้าต้องเลื่อนแนวนอน ให้ล็อกหัวคอลัมน์และคอลัมน์ซ้ายไว้ และมีสัญญาณว่ามีข้อมูลต่อ [NN/g: Mobile Tables](https://www.nngroup.com/articles/mobile-tables/)
- ทางเลือกที่มักดีกว่าสำหรับตารางไม่กี่คอลัมน์: เปลี่ยนเป็น **แถวกระชับ 2 บรรทัด** (ชื่อสังกัด + ค่า) หรือ accordion ตามกลุ่ม [NN/g: Mobile Tables](https://www.nngroup.com/articles/mobile-tables/)
- การ์ดต่อแถวทำให้เปรียบเทียบข้ามแถวยาก เพราะต้องกวาดตาและจำค่าและต้องใช้ working memory มากกว่าตาราง [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)

## 5. กราฟ: หลักที่เกี่ยวกับการแสดงค่าเปรียบเทียบ

- ใช้ **แท่งแนวนอน** เมื่อมีหลายหมวดหรือชื่อยาว และเรียงตามค่า [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)
- **แท่งต้องเริ่มที่ศูนย์** เพราะความยาวของแท่งถูกอ่านเป็นสัดส่วน ถ้าตัดแกนจะทำให้ภาพบิดเบือน [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)
- **Clustered bar** ควรมี 2 แท่งต่อกลุ่มเป็นค่าที่ดีที่สุด และไม่ควรเกิน 4 แท่ง [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)
- การรับรู้เชิงภาพ: ตำแหน่งบนสเกลร่วมแม่นยำที่สุด รองลงมาคือความยาว ส่วนมุม/พื้นที่แม่นยำน้อยกว่า [Cleveland & McGill, 1984](https://doi.org/10.1080/01621459.1984.10478080), [Cleveland & McGill, 1986](https://doi.org/10.1016/S0020-7373%2886%2980019-0)
- NN/g เตือนว่าสีไม่ควรใช้สื่อปริมาณหรือลำดับตัวเลข เพราะคนไม่ได้ perceive สีเป็นลำดับตาม magnitude [NN/g: Dashboards](https://www.nngroup.com/articles/dashboards-preattentive/)
- ป้ายค่าบนแท่งมีข้อจำกัดเรื่อง contrast และการจัดแนว AF แนะนำให้ทดสอบ และถ้าไม่แน่ใจ "a well structured table can often be as powerful as a chart" [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)

## 6. YoY: แสดงอะไร อย่างไร

### 6.1 ค่าจริงมาก่อน เปอร์เซ็นต์เป็นรอง

ผลต่างจริง (`target - base`) ตอบคำถาม "เพิ่ม/ลดกี่หน่วย" ส่วนเปอร์เซ็นต์ตอบคำถาม "เปลี่ยนเร็วแค่ไหนเมื่อเทียบกับฐาน" — เป็นคนละคำถาม [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/), [ONS: Principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles)

ข้อเสนอ:

- แสดง **ปีฐาน, ปีเปรียบเทียบ, ผลต่างจริง** ให้เห็นพร้อมกัน
- แสดง **YoY % เป็นข้อมูลรอง** ไม่ใช่ตัวเลขเดี่ยว ๆ
- ถ้าฐานเป็น 0 ให้แสดง "เริ่มมีข้อมูล/คำนวณเปอร์เซ็นต์ไม่ได้" พร้อมจำนวนจริง ไม่ใช่ +100%
- ถ้าฐานเล็กมาก ให้ติดป้าย "ฐานต่ำ" และระบุว่าเป็นกติกาของแดชบอร์ด ไม่ใช่ข้อสรุปทางสถิติ

### 6.2 การเรียง

- เรียงตาม **ขนาดผลต่างสัมบูรณ์** เมื่อคำถามคือ "อะไรเปลี่ยนมากที่สุด"
- ถ้าคำถามคือ "อะไรใหญ่ที่สุด" เรียงตามค่าปีล่าสุดหรือค่าที่เลือก
- คงลำดับปีตามธรรมชาติเมื่อแสดงแนวโน้ม [Government Analysis Function: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)

### 6.3 ฐานต่ำ/ข้อมูลหาย

- `0` หมายถึงมีข้อมูลครบแต่ไม่มีรายการ
- "ไม่มีข้อมูล" หมายถึงไม่มี coverage หรือแปลงปีไม่ได้ — อย่าแทนด้วย 0
- อย่าลากเส้นข้ามช่วงที่ไม่มีข้อมูล [ONS: Line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart)

## 7. ข้อเสนอเฉพาะสำหรับส่วน "รายละเอียดตามสังกัด" ใน `MissionYoYControls`

### 7.1 คำตอบ

**ควรเก็บไว้ แต่เปลี่ยนบทบาทจาก "เนื้อหาหลัก" เป็น "ชั้นตรวจสอบรายละเอียด"** เพราะ:

- กราฟให้ภาพรวมและการจัดอันดับได้ดีอยู่แล้ว
- ตารางให้ค่าจริงและ YoY % ที่กราฟไม่มี
- ตารางเป็น accessible equivalent ของกราฟ
- แต่การแสดงตาราง 5 คอลัมน์พร้อมกราฟที่ซ้ำกันทำให้จอแน่นและแย่งความสนใจจากข้อสรุป

### 7.2 รูปแบบที่แนะนำ

**สถานะยุบ (ค่าเริ่มต้น):**

```
รายละเอียดตามสังกัด   12 สังกัด · ↑5 ↓4 –3        [ดูรายละเอียด ▾]
```

**สถานะขยาย:**

```
รายละเอียดตามสังกัด                               [ย่อ ▴]
────────────────────────────────────────────────────────────
สังกัด                     ปีฐาน → ปีเปรียบเทียบ      YoY
วิศวกรรมคอมพิวเตอร์          24 → 31   (+7)         +29.2%
เทคโนโลยีสารสนเทศ           18 → 15   (−3)         −16.7%
... (สูงสุด 8 แถวตาม |ผลต่าง|)
                                          [แสดงทั้งหมด (12)]
```

หลักการ:

- **3 คอลัมน์** แทน 5: ชื่อสังกัด, `ปีฐาน → ปีเปรียบเทียบ (+ผลต่าง)`, YoY
- **แสดง top 8** ตามขนาดผลต่าง + ปุ่ม "แสดงทั้งหมด"
- **ซ่อนแถว 0 → 0** ในมุมมองค่าเริ่มต้น แต่ยังอยู่ใน "ทั้งหมด"
- **ไฮไลต์เฉพาะแถวที่ผิดปกติ** (เช่น |YoY| ≥ 20% หรือฐานต่ำ) ด้วยข้อความ/ไอคอน ไม่ใช้สีอย่างเดียว
- **เพิ่ม caption และ `scope`** ให้ตาราง
- **ผูกกราฟกับตาราง**: กราฟมี `aria-describedby` ไปยังคำอธิบาย/ตาราง; มีข้อความสรุป 1–2 บรรทัดใต้กราฟเสมอ
- **เพิ่มปุ่มดาวน์โหลด CSV** สำหรับตารางเต็ม (reference table)
- **เมื่อกรองสังกัดเดียว** (`activeDepartment !== 'all'`) ส่วนนี้เหลือแถวเดียว → ซ่อน หรือเปลี่ยนเป็น "เทียบกับภาพรวมคณะ"

### 7.3 เหตุผลเชิงแหล่งอ้างอิง

| ข้อเสนอ | เหตุผล | แหล่ง |
|---|---|---|
| ยุบตารางไว้ | ลดความรก, ให้ภาพรวมมาก่อน | [Shneiderman](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf), [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) |
| เก็บตารางไว้ | เป็นค่าจริง + accessible equivalent | [W3C 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [AF charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/) |
| 3 คอลัมน์ | ลดจำนวนคอลัมน์, รวมผลต่างไว้ในเซลล์เดียว | [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables) |
| top 8 + show all | ตารางสาธิตควรเล็ก, ลดภาระการอ่าน | [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables) |
| ซ่อน 0→0 | ไม่มีสาระในมุมมองเปรียบเทียบ | ข้อเสนอจากการออกแบบ |
| ชิดขวา/ทศนิยมเท่ากัน | อ่านและเทียบตัวเลขง่าย | [AF tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/) |
| caption/scope | โครงสร้างตารางเข้าถึงได้ | [W3C Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) |

## 8. Accessibility checklist สำหรับกราฟ + ตาราง

### กราฟ

- [ ] มีชื่อกราฟ/คำอธิบายที่บอก metric, หน่วย, ขอบเขตปี
- [ ] มีข้อความสรุปสารสำคัญ 1–2 ประโยค (ไม่ใช่แค่ชื่อกราฟ)
- [ ] canvas/SVG มี `role="img"` และ `aria-label` หรือ `aria-describedby`
- [ ] ไม่ใช้สีเป็นช่องทางเดียวในการแยกชุดข้อมูล — ใช้ legend, label, และรูปแบบเส้น/จุดที่แตกต่างกัน
- [ ] เส้น/แท่ง/จุดที่จำเป็นต่อการเข้าใจมี contrast ≥ 3:1 กับพื้นหลัง [W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [ ] ข้อความในกราฟมี contrast ≥ 4.5:1 (หรือ 3:1 สำหรับ large text) [W3C 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [ ] มีตารางหรือข้อความอธิบายยาวเป็นทางเลือก
- [ ] ให้ดาวน์โหลดข้อมูลได้ [AF charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)

### ตาราง

- [ ] มี `<caption>` ที่อธิบายเนื้อหา
- [ ] หัวคอลัมน์เป็น `<th scope="col">`; หัวแถวเป็น `<th scope="row">` [W3C Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/)
- [ ] ไม่มี merged cells ที่ซับซ้อน; ถ้าซับซ้อนให้แยกตาราง [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)
- [ ] ไม่มีเซลล์ว่าง — ใช้ "ไม่มีข้อมูล" หรือ "ไม่เกี่ยวข้อง" [GOV.UK: Tables](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables)
- [ ] ตัวเลขชิดขวาและมีความละเอียดเท่ากันในคอลัมน์
- [ ] ถ้าตารางกว้างกว่าจอ ให้ห่อด้วย scroll container ที่ `role="region"`, `tabindex="0"`, และ `aria-labelledby` [Adrian Roselli: Under-Engineered Responsive Tables](http://adrianroselli.com/2020/11/under-engineered-responsive-tables.html)
- [ ] ถ้าเรียงได้ ให้ใช้ `aria-sort` กับหัวคอลัมน์ [MOJ: Sortable table](https://design-patterns.service.justice.gov.uk/components/sortable-table)
- [ ] ไม่ใช้รูปภาพของตาราง [AF tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/)

## 9. สรุปเป็นหลักจำง่าย

1. **ถามก่อนว่า "ผู้ใช้จะทำอะไรกับข้อมูลนี้"** แล้วจึงเลือกกราฟ/ตาราง
2. **ภาพรวมก่อน รายละเอียดทีหลัง** — อย่าให้ตารางเต็มแย่งพื้นที่กับข้อสรุป
3. **ตารางมีค่าเมื่อต้องอ่านค่าจริง/ตรวจสอบ/เข้าถึง** — ไม่ใช่เมื่อทำซ้ำกราฟ
4. **ไม่เกิน 4–5 คอลัมน์และประมาณ 10 แถวคือขนาดที่อ่านสบาย** — เกินนั้นให้แยก/ยุบ/ดาวน์โหลด
5. **ตัวเลขต้องชิดขวา ทศนิยมเท่ากัน มีหน่วย และปัดอย่างมีเหตุผล**
6. **ทุกกราฟต้องมีข้อความทดแทน; ทุกตารางต้องมีหัวตารางที่ถูกต้อง**
7. **สีเป็นตัวช่วย ไม่ใช่ตัวสื่อความหมายเพียงอย่างเดียว**

## 10. หมายเหตุเรื่องระดับหลักฐาน

- **WCAG 2.2** เป็นข้อกำหนด normative ที่ใช้ตรวจสอบการเข้าถึง
- **GOV.UK, Government Analysis Function, NN/g, Carbon, Material** เป็นแนวปฏิบัติจากหน่วยงาน/งานวิจัยประสบการณ์ผู้ใช้ ไม่ใช่กฎหมาย; บางข้อเป็น heuristic ที่ควรทดสอบกับผู้ใช้จริง
- **Cleveland & McGill (1984, 1986)** เป็นงานทดลองเชิงประจักษ์เกี่ยวกับความแม่นยำของการรับรู้เชิงภาพ
- **Shneiderman (1996)** เป็นกรอบแนวคิดที่ได้รับการอ้างอิงอย่างกว้างขวาง ไม่ใช่ผลทดลองที่พิสูจน์สาเหตุ
- ข้อเสนอในหัวข้อ 7 เป็น **การสังเคราะห์** จากหลักข้างต้นกับบริบทของแดชบอร์ดนี้ ไม่ใช่คำแนะนำตรงจากแหล่งใดแหล่งหนึ่ง

## 11. Sources

1. [Government Analysis Function — Data visualisation: tables](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/) — ประเภทตาราง, การเปรียบเทียบตัวเลข, การจัดรูปแบบ, การเข้าถึง
2. [Government Analysis Function — Data visualisation: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/) — text alternative, data download, bar charts, value labels, clustered bars
3. [Government Analysis Function — Building and managing dashboards](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-building-and-managing-dashboards/) — ข้อจำกัดของแดชบอร์ดและความจำเป็นของรูปแบบข้อมูลอื่น
4. [GOV.UK Design System — Table](https://design-system.service.gov.uk/components/table) — ใช้ตารางเพื่อเปรียบเทียบข้อมูลเป็นแถว/คอลัมน์
5. [GOV.UK — Tables (content and publishing guidance)](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/tables) — ขนาดตาราง, การคำนวณให้ผู้ใช้, การจัดแนวตัวเลข
6. [W3C WAI — Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) — โครงสร้างตารางและ header
7. [W3C WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) — text alternative สำหรับกราฟ
8. [W3C WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — สีต้องไม่ใช่ช่องทางเดียว
9. [W3C WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — contrast 3:1 สำหรับ graphical objects
10. [W3C WCAG 2.2 — 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — contrast ของข้อความ
11. [W3C WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — การเลื่อนสองแกนและข้อยกเว้นสำหรับตาราง
12. [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — การแบ่งชั้นข้อมูลและข้อจำกัด 2 ชั้น
13. [NN/g — Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/) — ข้อดีของตาราง, การเปรียบเทียบ, การสแกน
14. [NN/g — Mobile Tables](https://www.nngroup.com/articles/mobile-tables/) — sticky headers, horizontal scroll, accordion
15. [NN/g — Dashboards: Making Charts and Graphs Easier to Understand](https://www.nngroup.com/articles/dashboards-preattentive/) — preattentive attributes, สีไม่ควรใช้สื่อปริมาณ
16. [Shneiderman, B. (1996) — The Eyes Have It](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf) — overview first, zoom and filter, details-on-demand
17. [Cleveland, W. S. & McGill, R. (1984) — Graphical Perception](https://doi.org/10.1080/01621459.1984.10478080) — ลำดับความแม่นยำของการรับรู้เชิงภาพ
18. [Cleveland, W. S. & McGill, R. (1986) — An Experiment in Graphical Perception](https://doi.org/10.1016/S0020-7373%2886%2980019-0) — position/length/angle/area
19. [Adrian Roselli — Under-Engineered Responsive Tables](http://adrianroselli.com/2020/11/under-engineered-responsive-tables.html) — scroll container ที่เข้าถึงได้
20. [MOJ Design System — Sortable table](https://design-patterns.service.justice.gov.uk/components/sortable-table) — `aria-sort`
21. [Carbon Design System — Data table](https://carbondesignsystem.com/building-blocks/core/components/data-table) — row size, expandable rows, placement
22. [Material Design — Data tables](https://m2.material.io/components/data-tables) — การจัดแนวตัวเลขชิดขวา
23. [ONS — Choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type) — เลือกกราฟตามความสัมพันธ์
24. [ONS — Principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles) — absolute vs percentage change
25. [ONS — Line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart) — missing periods และการไม่ลากเส้นข้ามข้อมูลที่หาย
