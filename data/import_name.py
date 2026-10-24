import os
import re
import json
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

URL_MAP = {
    "ภาควิชาวิศวกรรมการเกษตร": "https://eng.kps.ku.ac.th/20th/person-ae/",
    "ภาควิชาวิศวกรรมชลประทาน": "https://eng.kps.ku.ac.th/irre/personel/",
    "ภาควิชาวิศวกรรมอาหาร": "https://eng.kps.ku.ac.th/20th/person-fe/",
    "ภาควิชาวิศวกรรมโยธา": "https://eng.kps.ku.ac.th/20th/person-ce/",
    "ภาควิชาวิศวกรรมเครื่องกล": "https://eng.kps.ku.ac.th/20th/person-me/",
    "ภาควิชาวิศวกรรมอุตสาหการ": "https://eng.kps.ku.ac.th/20th/person-ie/",
    "ภาควิชาวิศวกรรมคอมพิวเตอร์": "https://eng.kps.ku.ac.th/20th/person-cpe/",
    "ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม": "https://eng.kps.ku.ac.th/20th/person-eeec/",
    "ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร": "https://eng.kps.ku.ac.th/20th/person-tdwcb/",
    "ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ": "https://eng.kps.ku.ac.th/20th/person-namc/",
    "สำนักงานเลขานุการ": "https://eng.kps.ku.ac.th/20th/sec/"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# ใช้ Session เพื่อเพิ่มความเร็วในการเชื่อมต่อ
session = requests.Session()
session.headers.update(headers)

title_pattern = re.compile(r'^(ผศ\.|รศ\.|ดร\.|อ\.|นาย|นาง|นางสาว)')

IMAGE_BASE_DIR = "profile_images"
os.makedirs(IMAGE_BASE_DIR, exist_ok=True)

final_data = {}

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).strip()

def download_image(img_url, save_path, retries=3):
    """ดาวน์โหลดรูปภาพพร้อม Retry Mechanism และเพิ่ม Timeout"""
    for attempt in range(retries):
        try:
            # เพิ่ม timeout เป็น 30 วินาที
            response = session.get(img_url, timeout=30)
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                return True
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)  # รอก่อนลองใหม่
            else:
                print(f"    - ดาวน์โหลดรูปไม่สำเร็จ ({clean_filename(os.path.basename(save_path))}): {e}")
    return False

print("=== เริ่มต้นสแครปข้อมูลและดาวน์โหลดรูปภาพ ===")

for dept_key, url in URL_MAP.items():
    print(f"\nกำลังดึงข้อมูล: {dept_key} ...")
    dept_personnel = []
    
    dept_folder = os.path.join(IMAGE_BASE_DIR, clean_filename(dept_key))
    os.makedirs(dept_folder, exist_ok=True)
    
    try:
        response = session.get(url, timeout=30)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')

        text = soup.get_text(separator="\n", strip=True)
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        for idx, line in enumerate(lines):
            if title_pattern.search(line) and len(line) < 80:
                name = line
                email = "ไม่พบอีเมล"
                position = "คณาจารย์/บุคลากร"
                image_path = "ไม่มีรูปภาพ"

                if idx > 0:
                    prev_line = lines[idx-1]
                    if not title_pattern.search(prev_line) and len(prev_line) < 80 and "@" not in prev_line:
                        position = prev_line

                for next_line in lines[idx+1:idx+4]:
                    if "@" in next_line and ("ku.ac.th" in next_line or "ku.th" in next_line):
                        email = next_line
                        break

                name_tag = soup.find(lambda tag: tag.string and name in tag.string)
                if name_tag:
                    card = name_tag.parent
                    for _ in range(5):
                        if card and card.name != 'body':
                            img_tag = card.find('img')
                            if img_tag and img_tag.get('src'):
                                img_url = urljoin(url, img_tag['src'])
                                img_filename = f"{clean_filename(name)}.jpg"
                                full_img_path = os.path.join(dept_folder, img_filename)
                                
                                if download_image(img_url, full_img_path):
                                    image_path = full_img_path
                                break
                            card = card.parent

                if not any(person['name'] == name for person in dept_personnel):
                    dept_personnel.append({
                        "name": name,
                        "position": position,
                        "email": email,
                        "image_path": image_path
                    })

    except Exception as e:
        print(f" เกิดข้อผิดพลาดกับ {dept_key}: {e}")

    final_data[dept_key] = dept_personnel
    print(f" สำเร็จ: ได้รับ {len(dept_personnel)} รายการ")

output_file = "ku_eng_personnel.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(final_data, f, ensure_ascii=False, indent=4)

print(f"\n=== บันทึกไฟล์ JSON เรียบร้อยแล้วที่: {output_file} ===")