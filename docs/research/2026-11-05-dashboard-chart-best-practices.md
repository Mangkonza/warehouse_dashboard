# แนวทางเลือกรูปแบบกราฟสำหรับ Warehouse Dashboard

วันที่ค้นคว้า: 5 พฤศจิกายน 2026

## สรุปสำหรับการออกแบบ

หลักสำคัญคือเลือกกราฟจากคำถามที่ต้องการตอบ ไม่ใช่พยายามเอาทุกตัวชี้วัดมาซ้อนในกราฟเดียว แนวทางของ ONS และ Government Analysis Function แยกความสัมพันธ์หลักเป็นแนวโน้มตามเวลา การจัดอันดับ การกระจาย องค์ประกอบของยอดรวม ความสัมพันธ์ และส่วนต่างจากเป้าหมาย พร้อมเตือนว่ากราฟที่ซับซ้อนหลายความสัมพันธ์มักอ่านยากกว่ากราฟเรียบง่ายสองกราฟ [ONS: choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type), [Government Analysis Function: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/).

สำหรับแดชบอร์ดนี้ ข้อสรุปเชิงปฏิบัติคือ:

- ใช้แท่งแนวนอนเพื่อจัดอันดับภาควิชา ผู้วิจัย ผู้ว่าจ้าง วารสาร และแหล่งทุน โดยเรียงค่าจากมากไปน้อยและเริ่มแกนที่ศูนย์ [ONS: bar charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/bar-charts).
- ใช้แกนเวลาที่เรียงจากเก่าไปใหม่ และเก็บเดือนพร้อมปีไว้ใน key; จำนวนเหตุการณ์รายเดือนเป็น flow จึงเหมาะกับแท่ง ส่วนแนวโน้มหลายปีใช้เส้นได้ [ONS: axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines), [ONS: choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type).
- โดยทั่วไปหลีกเลี่ยงแกน Y สองข้าง เพราะช่วงสเกลที่เลือกสามารถทำให้เส้นดูสัมพันธ์กันหรือไม่สัมพันธ์กันได้ เปรียบเทียบด้วยกราฟสองแผงที่ใช้แกน X ร่วมกัน หรือดัชนีฐาน 100 เมื่อคำถามคือ “โตเร็วแค่ไหน” [ONS: axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines).
- ใช้ stacked bar เฉพาะเมื่อส่วนประกอบรวมกันเป็นยอดเดียวและต้องการดูองค์ประกอบ; ใช้ 100% stacked bar เมื่อสนใจสัดส่วน ไม่ใช่ขนาดจริง และอย่าใช้ stacked bar เพื่อเปรียบเทียบส่วนกลางที่ไม่มี baseline ร่วม [ONS: stacked bar charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/stacked-bar-charts).
- ใช้กราฟง่ายเป็นมุมมองเริ่มต้น แล้วค่อยให้สลับรายละเอียดเมื่อจำเป็น; interaction ไม่ควรซ่อนข้อสรุปหลักไว้จนกว่าจะคลิก [ONS: interactive charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/interactive-charts-and-animations).

## แนวทางร่วมด้านการออกแบบ

### เปรียบเทียบจำนวน เงิน และค่าเฉลี่ย

จำนวนผลงานกับจำนวนเงินเป็นคนละหน่วย แม้จะมีช่วงเวลาเดียวกันก็ไม่ควรให้ผู้ใช้อ่านจากความสูงของแท่งกับเส้นบนแกนซ้าย/ขวาเป็นหลัก เพราะ dual axis อาจทำให้ความสัมพันธ์เปลี่ยนตามการตั้งสเกลได้ ทางเลือกที่แนะนำ:

1. กราฟสองแผงแนวตั้งซ้อนกัน ใช้แกน X และช่วงเวลาเดียวกัน แต่แสดงจำนวนกับเงินคนละแผง
2. ตัวเลือก metric ให้ดู “จำนวน” หรือ “เงิน” แยกกัน และคง tooltip ร่วม
3. ดัชนีฐาน 100 เมื่อเทียบการเปลี่ยนแปลงสัมพัทธ์ของจำนวนกับเงิน โดยระบุปีฐานชัดเจน
4. แสดงอัตราส่วน เช่น บาทสนับสนุนต่อผลงาน หรือบาทต่อโครงการ เพิ่มเป็น metric ประกอบ ไม่ใช้แทนยอดรวม

ข้อ 4 เป็น **ข้อเสนอจากการประยุกต์** แนวทาง ONS ที่ให้พิจารณาตัวแปรอนุพันธ์ เช่น ร้อยละของยอดรวม, อัตราต่อคน, และส่วนต่างจากค่าเฉลี่ย [ONS: principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles). อัตราส่วนบอกเฉพาะผลหาร ไม่ได้พิสูจน์ความคุ้มค่าหรือเหตุเป็นผล ต้องระบุช่วงเวลาและนิยามตัวเศษ/ตัวหาร โดยเฉพาะเงินสนับสนุนที่จ่ายคนละปีกับวันที่ตีพิมพ์

### แกน การเรียง และป้ายกำกับ

- แท่งเปรียบเทียบต้องเริ่มศูนย์; ถ้าความต่างเล็กจนมองยาก เปลี่ยนเป็น dot plot แทนการตัดแกนแท่ง [ONS: bar charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/bar-charts).
- ถ้าเปรียบเทียบหลายภาควิชาด้วย metric เดียวกัน ให้ใช้สเกลเดียวกันทุกกราฟ [ONS: axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines).
- ชื่อหมวดที่จัดอันดับให้เรียงตามค่าปัจจุบัน; ปี เดือน ควอร์ไทล์ และขั้นสถานะให้คงลำดับตามธรรมชาติ [ONS: ordering in charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/ordering-in-charts).
- แสดงหน่วยบนแกนหรือใน label เช่น “เรื่อง”, “โครงการ”, “ล้านบาท”, “บาท/ผลงาน”, “งาน/บุคลากร”; วันที่ควรมีเดือนและปี ไม่ใช้ชื่อเดือนลอย ๆ [ONS: chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text).
- ชื่อกราฟควรบอกประเด็นที่ต้องการให้เห็น ส่วนคำอธิบายระบุ metric, ขอบเขตข้อมูล และช่วงเวลา; หลีกเลี่ยงข้อความยาวซ้ำกันหลายจุด [ONS: chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text).

### สีและการเข้าถึง

- ใช้สีเดิมแทนหมวดเดิมข้ามกราฟ และใช้สีเน้นหนึ่งสีสำหรับค่าที่ต้องการชี้ให้เห็น; ลดจำนวนสีในกราฟองค์ประกอบและรวมหมวดเล็กเป็น “อื่น ๆ” เมื่อเหมาะสม [ONS: colours in charts](https://service-manual.ons.gov.uk/data-visualisation/colours/using-colours-in-charts).
- Q1–Q4 และ TCI 1–2 มีลำดับ/ความหมายต่างกัน ไม่ควรพึ่งสีเพียงอย่างเดียว: ใส่ชื่อ tier, legend, tooltip และเรียงตามลำดับที่อธิบายได้
- WCAG ระบุว่าอย่าใช้สีเป็นช่องทางเดียวในการสื่อความหมาย และส่วนกราฟที่จำเป็นต่อการเข้าใจควรมี contrast อย่างน้อย 3:1 จากสีติดกัน [W3C: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color), [W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).
- เมื่อมีหลายเส้นหรือหลาย tier จนสีและ legend เริ่มแยกยาก ให้ใช้ small multiples หรือเลือกแสดงไม่กี่ series; small multiples ช่วยลดการพึ่งสี [ONS: line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart).

ผลการทดลองด้าน graphical perception ของ Cleveland และ McGill พบว่าการตัดสินค่าจากตำแหน่งบนสเกลร่วมแม่นยำกว่าใช้ความยาว และการตัดสินพื้นที่แม่นยำน้อยกว่า [Cleveland & McGill, 1986](https://doi.org/10.1016/S0020-7373(86)80019-0). จึงควรเลือก bar/dot ที่ใช้ baseline ร่วมสำหรับการเทียบค่า แทน pie, bubble หรือ area เมื่อผู้ใช้อยากรู้ว่าค่าไหนมากกว่าเท่าไร

## ข้อเสนอแยกตามเรื่องและมิติ

คำแนะนำในตารางด้านล่างเป็น **การอนุมานเพื่อใช้กับข้อมูลจริงของโปรเจกต์** โดยอิงหลักเลือกกราฟข้างต้น ไม่ใช่ข้อกำหนดตายตัวจากแหล่งใดแหล่งหนึ่ง

| เรื่อง / มิติ | คำถามที่ต้องการตอบ | รูปแบบที่แนะนำ | วิธีแสดงและข้อควรระวัง |
|---|---|---|---|
| **ตีพิมพ์ — แนวโน้มจำนวนผลงานและเงินสนับสนุน** | ปริมาณตีพิมพ์กับเงินสนับสนุนเปลี่ยนอย่างไรตามเวลา | กราฟ 2 แผงที่ใช้แกนเวลาเดียวกัน: แท่งจำนวนผลงาน และแท่ง/เส้นเงินสนับสนุน | ใช้ key ปี-เดือน เช่น `month_year`; อย่ารวม ม.ค. จากหลายปี ป้ายทุกแกนด้วยหน่วย แสดงค่าเฉลี่ยบาท/ผลงานเป็น metric ประกอบและระบุว่าเป็นอัตราส่วนของระเบียนที่กรองอยู่; ไม่สรุปว่าการเพิ่มเงินทำให้ตีพิมพ์เพิ่ม |
| **ตีพิมพ์ — คุณภาพวารสารตามเวลา/ภาควิชา** | ผลงานอยู่ในระดับใดและสัดส่วนเปลี่ยนหรือไม่ | stacked column สำหรับจำนวนจริง; 100% stacked สำหรับสัดส่วน; small multiples หากหลาย tier | ใช้ลำดับ Q1→Q4 และแยก TCI ให้ชัด ควรลด series ให้เหลือไม่เกินประมาณ 5 สี หรือแบ่ง “นานาชาติ Q1–Q4” กับ “ระดับชาติ TCI” แล้วเปิดรายละเอียดด้วย tooltip/table; 100% bar ต้องรวมได้ 100% จริง |
| **ตีพิมพ์ — เปรียบเทียบภาควิชา/ผู้แต่ง/วารสาร** | ใครมีผลงานมากกว่าและเงินสนับสนุนเฉลี่ยต่างกันไหม | แท่งแนวนอนเรียงจากมากไปน้อย; กราฟจำนวนกับงบแยกแผงหรือเลือก metric | ชื่อวารสาร/คนยาวควรอยู่บนแกน Y; ค่าจำนวนผลงานเทียบข้ามหมวดใช้ baseline ศูนย์ ส่วนงบใช้หน่วยบาท/พันบาท/ล้านบาทที่อ่านง่ายและระบุชัด |
| **วิจัย — จำนวนโครงการและงบตามภาควิชา** | ภาควิชาใดมีโครงการมาก/งบมาก/งบเฉลี่ยต่อโครงการสูง | แท่งแนวนอนเรียงงบรวม หรือ dot plot สำหรับงบเฉลี่ย; จำนวนโครงการแสดงใน label/tooltip หรือแผงคู่ | อย่าให้จำนวนโครงการกับเงินบาทใช้แกนเดียว; แสดงงบภายใน/ภายนอกเป็น stacked bar เมื่อผลรวมตรงกับงบรวม หรือแสดง 100% stack เมื่อคำถามคือสัดส่วนแหล่งทุน |
| **วิจัย — แหล่งทุนตามภาควิชา/ปี** | เงินมาจากใคร และโครงสร้างแหล่งทุนเปลี่ยนอย่างไร | แท่งซ้อนตามแหล่งทุนเมื่อเทียบทั้งยอดรวมและองค์ประกอบ; 100% stacked เมื่อสนใจสัดส่วน | เลือกแหล่งทุนหลักไม่กี่หมวดแล้วรวมหมวดเล็กเป็นอื่น ๆ; แสดงจำนวนโครงการคู่กันในแผงหรือ tooltip ไม่ซ้อน count กับ money บนแกนเดียว |
| **วิจัย — แนวโน้มตามเวลา** | เงิน/โครงการวิจัยเกิดขึ้นช่วงใดและแนวโน้มระยะยาวเป็นอย่างไร | จำนวนโครงการรายเดือนเป็น column; งบรายเดือนเป็นอีกแผง; รายปีใช้เส้นเมื่อมีหลายปี | ใช้วันที่เริ่ม/สิ้นสุดหรือปีงบประมาณให้ตรงกับนิยาม metric; อย่าปะปนปีปฏิทินกับปีงบประมาณ; เดือนที่ไม่มีข้อมูลให้แยก “ศูนย์” ออกจาก “ไม่มีข้อมูล” |
| **พัฒนาวิชาการ — ผู้ว่าจ้าง** | ลูกค้ารายใดมีโครงการมาก มูลค่าสัญญารวมและเฉลี่ยเท่าไร | แท่งแนวนอนเรียงมูลค่ารวมหรือค่าเฉลี่ย; มีตัวเลือกสลับ total/average และจำนวนโครงการประกอบ | ค่าเฉลี่ย = มูลค่าสัญญารวม ÷ จำนวนสัญญาที่มีมูลค่าถูกต้อง; แสดง count ทุกครั้งเพื่อให้เห็นฐานของค่าเฉลี่ย; ระบุ “ไม่ระบุผู้ว่าจ้าง” เป็นหมวดแยก ไม่ปนกับชื่อจริง |
| **พัฒนาวิชาการ — เวลา** | จำนวนสัญญาและมูลค่าเกิดช่วงไหน | กราฟสองแผงตามเดือน/ปี หรือเลือก metric | โครงการที่ยาวหลายเดือนควรนับตามวันที่เริ่ม/สิ้นสุด/งวดเงินตามคำถาม ห้ามนับเป็นกิจกรรมรายเดือนโดยไม่มีนิยาม; metadata เดือนที่ไม่มีปีไม่เพียงพอสำหรับ trend ข้ามปี |
| **บริการวิชาการ — ภาควิชา/เดือน** | กิจกรรมมากที่ไหน และมีบุคลากรที่ร่วมออกงานกี่คน | แท่งกิจกรรม + จุด/แท่งจำนวนผู้ให้บริการในกราฟแยก; อีกกราฟเป็นกิจกรรมต่อผู้ให้บริการที่ระบุได้ | นิยาม denominator ว่า “ผู้ให้บริการที่พบในระเบียน” ไม่ใช่จำนวนอาจารย์ทั้งหมดหรือ FTE; แสดง count ผู้ให้บริการควบคู่ rate; ชื่อบุคลากรที่ไม่ระบุทำให้อัตราดูสูงเกินจริงได้ |
| **บริการวิชาการ — บทบาท/กลุ่มเป้าหมาย/SDG** | งานบริการกระจายไปยังกลุ่มใด | แท่งแนวนอนจัดอันดับ; stacked/100% stack เฉพาะเมื่อแต่ละกิจกรรมอยู่ในหมวดเดียวและต้องการสัดส่วน | ถ้าหนึ่งกิจกรรมมีหลายกลุ่มเป้าหมาย/หลาย SDG ยอดตามหมวดจะซ้อนกันและรวมเกินยอดกิจกรรม ให้เขียนว่าเป็นจำนวนการเชื่อมโยง ไม่เรียกว่า share of total |
| **ทรัพย์สินทางปัญญา — pipeline ตามภาควิชา** | ผลงานอยู่ระหว่างเตรียม ยื่น หรือได้รับคุ้มครองเท่าไร | stacked bar สำหรับจำนวน; 100% stacked สำหรับสัดส่วนตามภาควิชา | ใช้ลำดับสถานะตามขั้นงาน แต่ใช้ funnel เฉพาะเมื่อแต่ละขั้นเป็น cohort เดียวกันและจำนวนควรลดหลั่นกัน; สถานะ snapshot ที่คนละช่วงอายุไม่พิสูจน์ conversion rate |
| **ทรัพย์สินทางปัญญา — ประเภท/ผู้สร้างผลงาน/เงินสนับสนุน** | ประเภทใดหรือทีมใดมีผลงานมาก/ได้รับสนับสนุนสูง | แท่งแนวนอนจัดอันดับ; count และ support amount เป็นคนละ metric/แผง | ถ้าสิทธิบัตรมีผู้สร้างผลงานหลายคนหรือหลายภาควิชา ผลรวมตามบุคคล/ภาควิชาอาจนับระเบียนเดียวซ้ำ ต้องแยก “จำนวนระเบียน” จาก “จำนวนความร่วมมือ/เครดิต” |
| **บุคลากร — ผลงานแยกพันธกิจต่อคน** | ใครมีผลงานรวม/ผลงานแต่ละชนิดมาก และองค์ประกอบงานเป็นอย่างไร | แท่งแนวนอนเรียงผลงานรวม; stacked bar เพื่อดูสัดส่วนพันธกิจต่อคน | stacked bars เทียบยอดรวมได้ แต่ส่วนกลางเทียบกันไม่แม่น; ถ้าต้องเทียบผลงานชนิดเดียวกัน ให้ใช้ grouped bars หรือเลือก mission เดียว |
| **บุคลากร — ปริมาณงานต่อคน/ภาควิชา** | คนหรือภาควิชาที่มีงานต่อหน่วยทรัพยากรมากไหม | แสดงงานต่อบุคลากรที่ active/จำนวนอาจารย์เป็นอัตรา พร้อม count ฐาน; หากมีรายคนจำนวนมากใช้ dot plot/box plot | ตัวหารต้องเป็นจำนวนคนที่สอดคล้องกับขอบเขตเวลาและสถานะงาน; จำนวนอาจารย์ทั้งหมดไม่ใช่ FTE และผู้ร่วมงานหนึ่งชิ้นอาจมีหลายคน |
| **ภาพรวมผู้บริหาร — 5 พันธกิจตามปี** | ผลงานและงบเติบโตไปด้วยกันหรือไม่ | กราฟ small multiples แยกจำนวน/งบ หรือดัชนี 100 สำหรับเทียบอัตราโต | จำนวนกับเงินบาทไม่ควรอยู่แกนเดียว; ดัชนีต้องเลือกปีฐานและระบุชัด; ถ้าปีฐานเป็นศูนย์ให้แสดง “คำนวณไม่ได้/เริ่มมีข้อมูล” แทนเปอร์เซ็นต์โต |
| **ภาพรวมผู้บริหาร — YoY** | ปีนี้เปลี่ยนจากปีก่อนเท่าไร | dot/bar แสดงส่วนต่างจำนวนจริง และเปอร์เซ็นต์เปลี่ยนแปลงแยกเป็นข้อมูลรอง | เมื่อฐานต่ำหรือเป็นศูนย์ต้องติดป้าย low-base/new data; แสดงทั้งค่าปีก่อน ค่าปีเปรียบเทียบ และผลต่าง ไม่รายงานเปอร์เซ็นต์สูงอย่างโดดเดี่ยว |
| **KPI — ผลจริงเทียบเป้าหมาย** | KPI ใดถึงเป้าหมายและขาด/เกินเท่าไร | horizontal bullet/dot plot: bar actual, marker target; เรียงตาม gap หรือ % progress | ใช้หน่วยเดียวกับ KPI; ใส่เส้น target และตัวเลขจริง/เป้าหมาย ไม่พึ่งสีเขียว-แดงอย่างเดียว; เป้าหมายเป็น 0 หรือไม่กำหนดต้องจัดการแยก |

## การแมปกับกราฟในโค้ดปัจจุบัน

ตรวจจาก chart components และ metric metadata ใน `warehouse_dashboard/src` ณ วันที่ 5 พ.ย. 2026:

- หน้า publications มีแท่ง stacked Q tiers และเส้นเงินสนับสนุนบนแกนขวา; aggregate ปัจจุบันจัด bucket ด้วยชื่อเดือน จึงเสี่ยงรวมเดือนคนละปีเมื่อดูข้อมูลหลายปี [PublicationsCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/publications/_components/PublicationsCharts.tsx).
- หน้า research แสดงงบรวมรายภาควิชาและจำนวนโครงการในป้ายข้อมูล รวมทั้งมีสัดส่วนทุนภายใน/ภายนอกและแหล่งทุน [ResearchCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/research/_components/ResearchCharts.tsx).
- หน้า academic มีกราฟจำนวนโครงการ+งบรายเดือนและมูลค่ารวมรายผู้ว่าจ้าง; ข้อมูลมี `month`, `start_date`, `end_date`, `client`, `budget` แต่เดือนอาจไม่มีปี [AcademicCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/academic/_components/AcademicCharts.tsx), [AcademicItem](../../warehouse_dashboard/src/app/(dashboard)/academic/_hooks/useAcademicData.ts).
- หน้า service มีจำนวนกิจกรรมเทียบผู้ให้บริการที่ระบุได้ และกราฟภาระงานเฉลี่ยต่อผู้ให้บริการแล้ว [ServiceCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/service/_components/ServiceCharts.tsx).
- หน้า IP แสดงการกระจาย status และ pipeline funnel; ควรตรวจนิยาม cohort ก่อนตีความ funnel เป็น conversion rate [IPCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/ip/_components/IPCharts.tsx).
- หน้า personnel แสดงจำนวนผลงานรวมและแยกตาม 5 พันธกิจ; `DepartmentPersonnelStat` มีจำนวน faculty และ active แต่ความหมายของ denominator ต้องเขียนให้ชัดหากคำนวณ per-capita [PersonnelCharts.tsx](../../warehouse_dashboard/src/app/(dashboard)/personnel/_components/PersonnelCharts.tsx), [usePersonnelData.ts](../../warehouse_dashboard/src/app/(dashboard)/personnel/_hooks/usePersonnelData.ts).
- Overview มีโหมด volume, budget และ YoY แยกกันอยู่แล้ว การเพิ่มกราฟที่ซ้อน raw count กับเงินบาทจึงซ้ำซ้อนและเสี่ยงอ่านแกนผิด [ExecutiveMultiYearOverview.tsx](../../warehouse_dashboard/src/app/(dashboard)/overview/_components/ExecutiveMultiYearOverview.tsx).
- KPI cards แสดงค่าจริง/เป้าหมายและ progress; หากเพิ่มภาพรวม KPI ควรใช้ target marker และแสดงส่วนต่าง ไม่ต้องทำการ์ดอีกชุดที่ซ้ำข้อมูล [KpiGridCards.tsx](../../warehouse_dashboard/src/app/(dashboard)/kpi/_components/KpiGridCards.tsx).

## แนวทางเฉพาะสำหรับ YoY และข้อมูลหลายปี

### เลือกกราฟให้ตรงกับคำถาม

การเทียบสองปีของจำนวน/งบประมาณรายภาควิชาเป็นคำถามเรื่อง **ขนาดและส่วนต่างระหว่างหมวด** จึงเหมาะกับ grouped horizontal bar หรือ dot plot ที่มีจุดเริ่มเดียวกัน และแสดงตัวเลขค่าทั้งสองปีพร้อมผลต่าง ตารางตัวเลขควรอยู่คู่กันเมื่อจำเป็นต้องอ่านค่าตรง ๆ [ONS: choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type).

ยอดรวมรายปีเป็นข้อมูลแบบ flow (จำนวนรายการหรือเงินที่เกิดขึ้นภายในปี) ถ้าต้องการเน้นยอดจริงของปีที่มีเพียงไม่กี่จุด ใช้ column chart ที่แกนเริ่มศูนย์; ถ้าคำถามหลักคือทิศทางแนวโน้ม ใช้ line chart โดยทำ marker สำหรับจุดข้อมูลที่มีน้อยหรือเป็น flow. อย่าลากเส้นข้ามปีที่ไม่มีข้อมูล เพราะจะสื่อว่ามีค่าต่อเนื่องซึ่งไม่มีหลักฐานรองรับ [ONS: column charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/column-chart), [ONS: line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart).

ถ้าต้องการเห็นทั้งภาพรวมและรายละเอียดภาควิชา ให้เริ่มจากภาพรวมปีต่อปี แล้วตามด้วยรายละเอียดแยกภาควิชา; แยกเป็นกราฟง่ายสองแบบได้ชัดกว่าการอัดหลายมิติในกราฟเดียว [ONS: choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type).

### แสดง YoY ด้วยค่าจริงควบคู่เปอร์เซ็นต์

การเปลี่ยนแปลงเป็นจำนวนจริงและการเปลี่ยนแปลงเป็นเปอร์เซ็นต์ตอบคนละคำถาม: `target - base` บอกจำนวนที่เพิ่ม/ลด; `((target - base) / base) × 100` บอกการเปลี่ยนเทียบกับฐาน. ONS ยกตัวอย่างว่าค่าดิบสองช่วงเวลาอาจไม่ทำให้เห็น “อัตราการเปลี่ยน” ชัด และแนะนำตัวแปรอนุพันธ์อย่าง percentage change เมื่อคำถามคือความเร็วของการเปลี่ยน [ONS: principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles).

เมื่อฐานเล็ก อัตราร้อยละอาจสูงมากแม้จำนวนเพิ่มไม่มาก; ให้แสดงค่าปีฐาน, ค่าปีเปรียบเทียบ และผลต่างเป็นจำนวนจริงใกล้กัน แล้ววางเปอร์เซ็นต์เป็นข้อมูลรองพร้อมคำอธิบายฐานต่ำ. กรณีฐานเป็นศูนย์ ไม่ควรแทนการหารด้วยศูนย์เป็น “+100%”: แสดง “เริ่มมีข้อมูล” หรือ “คำนวณเปอร์เซ็นต์ไม่ได้” พร้อมจำนวนจริงแทน. นี่เป็นข้อเสนอการสื่อสารจากสูตรและกรณี base effects; ไม่มีเกณฑ์สากลที่บอกว่าฐานต่ำต้องน้อยกว่าเลขใดเลขหนึ่ง. หากตั้งเกณฑ์ เช่น <5 รายการ ให้ระบุว่าเป็นกติกาของ dashboard ไม่ใช่นัยสำคัญทางสถิติ. ONS อธิบายว่า low base can exaggerate growth rates and advises users to be aware of base effects [ONS: Beware base effects](https://blog.ons.gov.uk/2021/05/19/beware-base-effects/).

### แยกศูนย์ออกจากข้อมูลหาย

- `0` ใช้เมื่อระบบยืนยันว่าช่วงเวลานั้นอยู่ในขอบเขตข้อมูลครบถ้วนแต่ไม่มีรายการ.
- “ไม่มีข้อมูล” ใช้เมื่อไม่มีระเบียน/coverage สำหรับช่วงนั้น หรือวันปีอ่านไม่ได้; อย่าปล่อยให้ค่าหายกลายเป็นศูนย์หรือจัดเข้าปีปริยาย.
- ใน line chart ให้เว้นช่วงที่ขาดข้อมูลเพื่อไม่สื่อความต่อเนื่อง; ใน column chart ปล่อยช่วงนั้นว่างและอธิบายสาเหตุถ้าทราบ [ONS: line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart), [ONS: column charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/column-chart).
- สำหรับ heatmap แยก missing ด้วยเครื่องหมายและคำอธิบายที่ชัดเจน; อย่าใช้เฉดสีอ่อนสุดแทน missing ถ้าเฉดเดียวกันอาจหมายถึงค่าต่ำหรือศูนย์.

### Heatmap ภาควิชา × ปี

Heatmap เหมาะเป็น **ภาพรวมเพื่อสแกนรูปแบบของหลายภาควิชาตลอดหลายปี** เพราะใช้สีแทนระดับเชิงปริมาณในตารางกริด [ONS: using colours in charts](https://service-manual.ons.gov.uk/data-visualisation/colours/using-colours-in-charts). แต่สีเป็นตัวช่วยค้นหารูปแบบ ไม่ใช่ตัวแทนค่าที่แม่นยำ: แสดงตัวเลขในช่องหรือมีตารางตัวเลขเข้าถึงได้คู่กัน, ใส่ legend/ช่วงค่า, ใช้ palette ลำดับเดียวและสีไม่เกินจำเป็น. อย่าใช้ rainbow palette หรือแสดงสีอย่างเดียว เพราะผู้ใช้ต้องแยกทั้งความเข้มและข้อความ; W3C กำหนดให้ข้อมูลที่สื่อด้วยสีมี cue อื่นประกอบ [W3C: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color).

สำหรับข้อมูลนี้ให้เริ่มจากจำนวนรายการต่อภาควิชาและปี (หน่วยชัดเจน), เรียงภาควิชาด้วยยอดปีล่าสุดหรือยอดรวม, คงลำดับปีเก่าไปใหม่. งบประมาณควรเป็น metric สลับแยกต่างหาก ไม่รวมกับจำนวนในสเกลสีเดียว. ถ้าจำนวนภาควิชาทำให้ heatmap อ่านแน่น ให้ใช้ bar chart ของปีที่เลือกหรือ small multiples แทน; chart แบบ interactive ไม่ควรซ่อนสารหลักไว้หลังการคลิก [ONS: interactive charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/interactive-charts-and-animations).

### ชื่อกราฟและจอเล็ก

ชื่อ/คำโปรยต้องระบุ metric, หน่วย, ขอบเขต และปีที่เลือก; ป้ายแกนไม่ควรล้นหรือซ้อนกัน. ONS ระบุให้ข้อความกระชับและอ่านได้ทั้งมือถือ/desktop และเน้นว่า chart title ควรบอกแนวโน้มหลัก [ONS: chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text). บนจอมือถือให้ลด ticks ที่ซ้ำแต่คงจุดเริ่มต้น/ปลายช่วงและหน่วยไว้; ถ้าช่อง heatmap แคบจนตัวเลขอ่านไม่ได้ ให้สลับเป็นรายการเรียงลำดับหรือแสดงตารางเลื่อนในกรอบของตัวเอง และคงค่าเป็นข้อความ/tooltip ที่เข้าถึงได้.

### ข้อสรุปสำหรับหน้าจอ YoY ปัจจุบัน

1. **เก็บมุมเทียบสองปี:** แท่งแนวนอน grouped แยกค่าปีฐานกับปีเปรียบเทียบ, เรียงตามขนาดผลต่าง, แสดงค่าจริง+ผลต่างและตารางตัวเลข. ใช้เปอร์เซ็นต์เป็นรองและติดคำอธิบายเมื่อฐานต่ำ.
2. **เพิ่มมุมหลายปี:** ยอดรายปีใช้ column chart เป็นค่าเริ่มต้นเมื่อเน้นยอดรวม/มีจุดข้อมูลไม่กี่ปี; ใช้เส้นที่มีจุดเฉพาะเมื่อเน้นทิศทางแนวโน้ม. แสดงปีที่ไม่มีข้อมูลเป็นช่องว่าง/“ไม่มีข้อมูล” และห้ามเชื่อมเส้นข้าม missing.
3. **เพิ่มรายละเอียดหลายหมวด:** heatmap ภาควิชา × ปีเป็นภาพรวมเสริม ใช้สีระดับเดียว, แสดงตัวเลขในเซลล์, มี legend และมีตาราง/รายการเป็นทางเลือกสำหรับมือถือและผู้ใช้ที่แยกสีไม่สะดวก.
4. **ซื่อสัตย์กับฐานข้อมูล:** ปีที่มี coverage แล้วไม่พบระเบียนคือ 0; ปีที่ coverage ไม่ครบหรือปีสกัดไม่ได้คือ “ไม่มีข้อมูล/ต้องตรวจสอบ”. ไม่สรุปแนวโน้มหรืออัตราการเติบโตของข้อมูลที่ยังไม่ครบ.

## Sources

1. [Government Analysis Function — Data visualisation: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/) — ความสัมพันธ์ข้อมูลกับชนิดกราฟ รวมถึง time series, ranking, correlation และ part-to-whole.
2. [ONS — Choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type) — เลือกกราฟตามความสัมพันธ์, baseline ที่สอดคล้อง, data derived, และแยกกราฟเมื่อหลายความสัมพันธ์ซับซ้อน.
3. [ONS — Bar charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/bar-charts) — แท่งแนวนอนสำหรับเทียบหมวด, sort ตามค่า, baseline ศูนย์.
4. [ONS — Line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart) — แนวโน้มเวลาและ small multiples.
5. [ONS — Stacked bar charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/stacked-bar-charts) — ยอดรวม/องค์ประกอบ, 100%, ข้อจำกัดของ stacked components.
6. [ONS — Axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines) — baseline, axis consistency, dual axes, orientation.
7. [ONS — Ordering in charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/ordering-in-charts) — เรียงค่ามากไปน้อย ยกเว้นลำดับธรรมชาติ และลำดับ segment.
8. [ONS — Chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text) — title, subtitle, axis units, date and label conventions.
9. [ONS — Colours in charts](https://service-manual.ons.gov.uk/data-visualisation/colours/using-colours-in-charts) — จำกัดสี ใช้สีสม่ำเสมอ และรองรับหมวดที่มีลำดับ.
10. [ONS — Interactive charts](https://service-manual.ons.gov.uk/data-visualisation/guidance/interactive-charts-and-animations) — interaction อาจซ่อนข้อสรุปและ small multiples เป็นทางเลือก.
11. [W3C — WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) and [WCAG 2.1 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) — อย่าพึ่ง hue อย่างเดียวและให้กราฟิกสำคัญมี contrast เพียงพอ.
12. [Cleveland & McGill (1986), “An experiment in graphical perception”](https://doi.org/10.1016/S0020-7373(86)80019-0) — การตัดสินค่าจากตำแหน่งบนสเกลร่วมแม่นยำกว่าความยาว มุม/ความชัน และพื้นที่.
13. [ONS — Column charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/column-chart) — flow data, few time points, missing periods.
14. [ONS — Line charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart) — trends over time, markers for few/flow data points, leave gaps in missing periods.
15. [ONS — Principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles) — derived percentage change and absolute values answer different comparison questions.
16. [ONS — Beware base effects](https://blog.ons.gov.uk/2021/05/19/beware-base-effects/) — growth rates can be amplified by an unusually low comparison base.
17. [ONS — Chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text) — titles should state the main trend; concise text should remain legible on mobile and desktop.
18. [ONS — Colours in charts](https://service-manual.ons.gov.uk/data-visualisation/colours/using-colours-in-charts) — quantitative values, including heatmaps, can use color scales; use sufficient contrast, intuitive consistent colors, and limit categories.
19. [W3C — WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — do not rely on color alone to communicate information.
