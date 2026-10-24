#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete ETL Pipeline: Raw KU Engineering Excel Files (12 files) -> Clean JSON Datasets
Extracts, cleanses, normalizes, matches personnel, and deduplicates all domains:
  1. Research Projects (research.json / persisted_research.json)
  2. Academic Development Projects (academic.json / persisted_academic.json)
  3. Academic Services (services.json / persisted_services.json)
  4. Academic Publications (publications.json / persisted_publications.json)
  5. Intellectual Property (ip.json / persisted_ip.json)
  6. Personnel Master Data (personnel.json / persisted_personnel.json)
  7. Funding Sources (funding_sources.json)
  8. Strategic KPIs (strategic_kpis.json)
"""

import os
import re
import json
import datetime
import openpyxl

EXCEL_DIR = "/Users/macbook/Documents/Projects/dataWerehouse"
if not os.path.exists(EXCEL_DIR):
    EXCEL_DIR = "/Users/macbook/Projects/warehouse_dashboard/data"

OUT_DIR = "/Users/macbook/Projects/warehouse_dashboard/warehouse_dashboard/src/data"
os.makedirs(OUT_DIR, exist_ok=True)

# ==============================================================================
# 1. Load & Clean Personnel Master Data (personnel.json)
# ==============================================================================
PERSONNEL_PATH = os.path.join(OUT_DIR, "personnel.json")
with open(PERSONNEL_PATH, "r", encoding="utf-8") as f:
    raw_personnel = json.load(f)

TITLE_REGEX = re.compile(
    r"^(ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|อาจารย์|"
    r"ศ\.ดร\.|รศ\.ดร\.|ผศ\.ดร\.|อ\.ดร\.|น\.สพ\.ดร\.|"
    r"ศ\.|รศ\.|ผศ\.|อ\.|ดร\.|"
    r"ว่าที่\s*ร\.ต\.หญิง|ว่าที่\s*ร\.ต\.|ร้อยโท|ร\.ท\.|"
    r"นางสาว|น\.ส\.|นาง|นาย)\s*",
    re.UNICODE,
)


def strip_titles(name_str: str) -> str:
    s = str(name_str or "").replace("\xa0", " ").replace("\n", " ").replace("\r", " ").strip()
    s = re.sub(r"\s+", " ", s)
    prev = None
    while prev != s:
        prev = s
        s = TITLE_REGEX.sub("", s).strip()
    return re.sub(r"\s+", " ", s)


def extract_prefix_and_clean(name_str: str):
    s = str(name_str or "").replace("\xa0", " ").replace("\n", " ").replace("\r", " ").strip()
    s = re.sub(r"\s+", " ", s)
    clean = strip_titles(s)
    prefix = s[: len(s) - len(clean)].strip() if clean and s.endswith(clean) else ""
    return prefix, clean, s


CANONICAL_DEPTS = [
    ("ภาควิชาวิศวกรรมเกษตร", ["วิศวกรรมเกษตร", "วิศวกรรมการเกษตร", "เกษตร", "AE", "ABE"]),
    ("ภาควิชาวิศวกรรมชลประทาน", ["ชลประทาน", "IRE"]),
    ("ภาควิชาวิศวกรรมการอาหาร", ["อาหาร", "FE"]),
    ("ภาควิชาวิศวกรรมโยธา", ["โยธา", "CE"]),
    ("ภาควิชาวิศวกรรมเครื่องกล", ["เครื่องกล", "ME"]),
    ("ภาควิชาวิศวกรรมอุตสาหการ", ["อุตสาหการ", "IE"]),
    ("ภาควิชาวิศวกรรมคอมพิวเตอร์", ["คอมพิวเตอร์", "CPE"]),
    ("ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม", ["พลังงานและสิ่งแวดล้อม", "EEEC"]),
    ("ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร", ["ประตู", "หน้าต่าง", "ผนังกระจก", "DWT", "TDWCB"]),
    ("ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ", ["เครื่องจักรกลการเกษตรแห่งชาติ", "NAMC"]),
    ("สำนักงานเลขานุการ", ["สำนักงานเลขานุการ", "เลขานุการ", "OFS"]),
]


def normalize_department(raw_dept: str, fallback: str = "") -> str:
    if not raw_dept:
        return fallback
    s = str(raw_dept).replace("\xa0", " ").replace("\n", " ").replace("\r", " ").strip()
    s = re.sub(r"\s+", " ", s)
    if s in ("-", "nan", "NaT", "None", "ü", "P", ""):
        return fallback

    # Handle multiple departments separated by newline or comma
    found = []
    for canonical, keywords in CANONICAL_DEPTS:
        for kw in keywords:
            if kw in s:
                if canonical not in found:
                    found.append(canonical)
                break
    if found:
        return ", ".join(found)
    return s


# Clean personnel list (remove test records)
cleaned_personnel = []
person_by_clean_name = {}
person_by_first_name = {}

for idx, p in enumerate(raw_personnel):
    name = str(p.get("name") or "").strip()
    if not name or name.lower() in ("test", "nan", "เรื่อง"):
        continue
    pid = p.get("id") if isinstance(p.get("id"), int) else (idx + 1)
    prefix, clean_n, full_n = extract_prefix_and_clean(name)
    title_th = p.get("title_th") or prefix
    dept = normalize_department(p.get("department", ""), p.get("department", ""))
    rec = {
        **p,
        "id": pid,
        "_id": str(pid),
        "title_th": title_th,
        "name": full_n,
        "clean_name": clean_n,
        "department": dept,
    }
    cleaned_personnel.append(rec)
    norm_key = re.sub(r"\s+", "", clean_n).lower()
    if norm_key:
        person_by_clean_name[norm_key] = rec
        first_part = clean_n.split(" ")[0].strip().lower()
        if len(first_part) >= 4:
            person_by_first_name.setdefault(first_part, []).append(rec)


def match_person(raw_name: str):
    if not raw_name:
        return None
    _, clean_n, _ = extract_prefix_and_clean(raw_name)
    clean_n = re.sub(r"และคณะ.*$", "", clean_n).strip()
    norm_key = re.sub(r"\s+", "", clean_n).lower()
    if not norm_key or len(norm_key) < 3:
        return None
    if norm_key in person_by_clean_name:
        return person_by_clean_name[norm_key]
    # Try partial / substring match with 1-character typo tolerance
    for k, rec in person_by_clean_name.items():
        if norm_key in k or k in norm_key:
            return rec
    # Try matching by first name if unique
    first_part = clean_n.split(" ")[0].strip().lower()
    if first_part in person_by_first_name and len(person_by_first_name[first_part]) == 1:
        return person_by_first_name[first_part][0]
    return None


# ==============================================================================
# 2. Common Cleansing Helpers (Text, Money, Dates, Checkmarks)
# ==============================================================================
THAI_MONTH_MAP = {
    "ม.ค.": 1, "มกราคม": 1, "ม.ค": 1,
    "ก.พ.": 2, "กุมภาพันธ์": 2, "ก.พ": 2,
    "มี.ค.": 3, "มีนาคม": 3, "มี.ค": 3,
    "เม.ย.": 4, "เมษายน": 4, "เม.ย": 4,
    "พ.ค.": 5, "พฤษภาคม": 5, "พ.ค": 5,
    "มิ.ย.": 6, "มิถุนายน": 6, "มิ.ย": 6,
    "ก.ค.": 7, "กรกฎาคม": 7, "ก.ค": 7,
    "ส.ค.": 8, "สิงหาคม": 8, "ส.ค": 8,
    "ก.ย.": 9, "กันยายน": 9, "ก.ย": 9,
    "ต.ค.": 10, "ตุลาคม": 10, "ต.ค": 10,
    "พ.ย.": 11, "พฤศจิกายน": 11, "พ.ย": 11,
    "ธ.ค.": 12, "ธันวาคม": 12, "ธ.ค": 12,
}

THAI_MONTH_ABBR = [
    "", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
]


def clean_str(val) -> str:
    if val is None:
        return ""
    if isinstance(val, datetime.datetime) or isinstance(val, datetime.date):
        return ""
    s = str(val).replace("\xa0", " ").replace("\r\n", " ").replace("\n", " ").replace("\r", " ").strip()
    s = re.sub(r"\s+", " ", s)
    if s in ("-", "–", "—", "nan", "NaT", "None", "ไม่มี", "."):
        return ""
    return s


def parse_money(val) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val) if val > 0 else 0.0
    s = str(val).replace(",", "").replace("฿", "").replace("บาท", "").strip()
    if s in ("-", "", "nan", "ไม่มี"):
        return 0.0
    m = re.search(r"(\d+(?:\.\d+)?)", s)
    return float(m.group(1)) if m else 0.0


def is_checked(val) -> bool:
    if val is None:
        return False
    s = str(val).strip()
    if not s or s in ("-", "–", "ไม่มี", "0", "false", "False", "nan"):
        return False
    return True


def to_year_be(y: int) -> int:
    """
    Normalizes any year to Buddhist Era (พ.ศ. 24xx..26xx):
    - Excel Gregorian Date Bug (1955..1985 -> +600 years, e.g. 1968 -> 2568, 1969 -> 2569)
    - Gregorian year (1986..2100 -> +543 years, e.g. 2025 -> 2568, 2001 -> 2544)
    - Buddhist Era year (2480..2620 -> unchanged, e.g. 2568 -> 2568)
    - 2-digit BE year (40..99 -> 2500 + y, e.g. 68 -> 2568)
    """
    if 1955 <= y <= 1985:
        return y + 600
    if 1986 <= y <= 2100:
        return y + 543
    if 2480 <= y <= 2620:
        return y
    if 40 <= y <= 99:
        return 2500 + y
    if 0 <= y <= 39:
        return 2000 + y + 543
    return y


def parse_clean_date(val, fallback_year_be: int = 2568):
    """
    Returns (start_date_be, end_date_be) in 'YYYY-MM-DD' format using Buddhist Era (พ.ศ.) year (e.g. '2568-01-07').
    Handles datetime objects, ISO strings, Thai text dates like '14-20 ม.ค.-69', '8 มี.ค. 66', '23 พ.ย. 66-7 มี.ค. 72'.
    """
    fallback_be = to_year_be(fallback_year_be)
    if val is None:
        return "", ""
    if isinstance(val, (datetime.datetime, datetime.date)):
        y_be = to_year_be(val.year)
        iso = f"{y_be:04d}-{val.month:02d}-{val.day:02d}"
        return iso, iso

    s = str(val).replace("\xa0", " ").replace("\n", " ").replace("\r", " ").strip()
    s = re.sub(r"\s+", " ", s)
    if not s or s in ("-", "ไม่มี", "nan", "NaT", "."):
        return "", ""

    # Check if ISO datetime string like '1968-01-07 00:00:00' or '2569-04-04'
    iso_m = re.match(r"^(\d{4})-(\d{1,2})-(\d{1,2})", s)
    if iso_m:
        y_be = to_year_be(int(iso_m.group(1)))
        m = int(iso_m.group(2))
        d = int(iso_m.group(3))
        iso = f"{y_be:04d}-{m:02d}-{d:02d}"
        return iso, iso

    # Check if Thai range with two full dates: e.g. '23 พ.ย. 66- 7 มี.ค. 72' or '1 พ.ย.67- 25 ธ.ค.72'
    parts_dash = re.split(r"\s*[-–]\s*", s)
    if len(parts_dash) == 2 and any(k in parts_dash[0] for k in THAI_MONTH_MAP) and any(k in parts_dash[1] for k in THAI_MONTH_MAP):
        d1, _ = parse_clean_date(parts_dash[0], fallback_be)
        d2, _ = parse_clean_date(parts_dash[1], fallback_be)
        if d1 or d2:
            return d1, d2 or d1

    # Check Thai day range within same month: e.g. '14-20 ม.ค.-69' or '27-30 เม.ย.69' or '8 มี.ค. 66'
    for th_m, m_num in sorted(THAI_MONTH_MAP.items(), key=lambda x: -len(x[0])):
        if th_m in s:
            idx = s.find(th_m)
            before = s[:idx]
            after = s[idx + len(th_m) :]
            days = [int(x) for x in re.findall(r"\d+", before) if 1 <= int(x) <= 31]
            years = [int(x) for x in re.findall(r"\d+", after)]
            y_be = to_year_be(years[-1]) if years else fallback_be
            d_start = days[0] if days else 1
            d_end = days[-1] if len(days) > 1 else d_start
            return f"{y_be:04d}-{m_num:02d}-{d_start:02d}", f"{y_be:04d}-{m_num:02d}-{d_end:02d}"

    return "", ""


def get_fiscal_year_be(iso_date: str, default_be: int = 2568) -> int:
    if not iso_date or len(iso_date) < 7:
        return default_be
    try:
        y = int(iso_date[:4])
        m = int(iso_date[5:7])
        be = to_year_be(y)
        return be + 1 if m >= 10 else be
    except Exception:
        return default_be


def split_people_names(raw_val) -> list:
    s = str(raw_val or "").replace("\xa0", " ").strip()
    if not s or s in ("-", "ไม่มี", "nan"):
        return []
    # Split by newline, comma, semicolon, or ' และ'
    parts = re.split(r"[\n\r,;]+|\s+และ\s*", s)
    res = []
    for p in parts:
        c = re.sub(r"\s+", " ", p).strip()
        c = re.sub(r"^\d+[\.\)]\s*", "", c).strip()
        if c and c not in ("-", "ไม่มี", "และคณะ"):
            res.append(c)
    return res


def detect_sdg(name: str, dept: str) -> str:
    txt = f"{name} {dept}".lower()
    if any(k in txt for k in ["น้ำ", "ชลประทาน", "ประปา", "บำบัดน้ำ", "ลุ่มน้ำ", "น้ำท่วม", "ฝน"]):
        return "SDG 6"
    if any(k in txt for k in ["พลังงาน", "เชื้อเพลิง", "ไพโรไลซิส", "ก๊าซ", "ความร้อน", "ไฟฟ้า", "โซลาร์", "ชีวมวล"]):
        return "SDG 7"
    if any(k in txt for k in ["อาหาร", "เกษตร", "ข้าว", "อ้อย", "มะม่วง", "ปาล์ม", "ทุเรียน", "พืช", "ดิน", "ปุ๋ย", "วัชพืช"]):
        return "SDG 2"
    if any(k in txt for k in ["เรียน", "สอน", "นิสิต", "ศึกษา", "หลักสูตร"]):
        return "SDG 4"
    if any(k in txt for k in ["ขยะ", "พลาสติก", "รีไซเคิล", "คาร์บอน", "สิ่งแวดล้อม", "มลพิษ", "ฝุ่น"]):
        return "SDG 13"
    if any(k in txt for k in ["สุขภาพ", "การแพทย์", "ผู้สูงอายุ", "ปลอดภัย"]):
        return "SDG 3"
    return "SDG 9"


# ==============================================================================
# 3. ETL Domain 1: Research Projects (โครงการวิจัย)
# ==============================================================================
def etl_research_projects():
    records_by_key = {}
    auto_seq_68 = 1
    auto_seq_69 = 1

    sources = [
        ("โครงการวิจัย 2568.xlsx", ["รวม", "ก.พ.68 ", "พ.ค.68", "มิ.ย.68", "ก.ค.68", "ส.ค.68", "ก.ย.68 ", "พ.ย.68"], 2568),
        ("1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ม.ค.2569.xlsx", ["1-โครงการวิจัย"], 2569),
        ("3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["1-โครงการวิจัย"], 2569),
        ("4.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["1-โครงการวิจัย"], 2569),
        ("5.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["1-โครงการวิจัย"], 2569),
    ]

    for fname, sheets, default_fy in sources:
        fpath = os.path.join(EXCEL_DIR, fname)
        if not os.path.exists(fpath):
            continue
        wb = openpyxl.load_workbook(fpath, data_only=True)
        for sname in sheets:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]
            # Find header row with 'ลำดับ'
            start_row = 4
            for r in range(1, 8):
                vals = [str(ws.cell(r, c).value or "") for c in range(1, 10)]
                if any("ลำดับ" in v for v in vals):
                    start_row = r + 2
                    break

            for r in range(start_row, ws.max_row + 1):
                seq = ws.cell(r, 1).value
                raw_code = clean_str(ws.cell(r, 2).value)
                name = clean_str(ws.cell(r, 3).value)
                head_raw = clean_str(ws.cell(r, 4).value)
                if not name or len(name) < 3 or "ชื่อโครงการ" in name or "สรุปโครงการ" in name:
                    continue

                co_raw = ws.cell(r, 5).value
                dept_raw = clean_str(ws.cell(r, 6).value)
                collab_dom = ws.cell(r, 7).value
                collab_for = ws.cell(r, 8).value
                nat_str = ws.cell(r, 9).value
                nat_pol = ws.cell(r, 10).value
                bud_in = parse_money(ws.cell(r, 11).value)
                bud_ex = parse_money(ws.cell(r, 12).value)
                fund_src = clean_str(ws.cell(r, 13).value)
                raw_start = ws.cell(r, 14).value
                raw_end = ws.cell(r, 15).value
                int_teach = clean_str(ws.cell(r, 16).value)
                int_res_teach = clean_str(ws.cell(r, 17).value)
                int_serv = clean_str(ws.cell(r, 18).value) if ws.max_column >= 18 else ""
                trl_raw = clean_str(ws.cell(r, 19).value) if ws.max_column >= 19 else ""
                remarks_raw = clean_str(ws.cell(r, 20).value) if ws.max_column >= 20 else ""

                # Match head person
                matched_head = match_person(head_raw)
                head_name = matched_head["name"] if matched_head else head_raw
                head_id = matched_head["id"] if matched_head else None
                dept = normalize_department(dept_raw, matched_head["department"] if matched_head else "คณะวิศวกรรมศาสตร์ กำแพงแสน")

                # Parse co-researchers
                co_names = split_people_names(co_raw)
                co_researchers = []
                depts_set = [dept] if dept else []
                for cn in co_names:
                    mp = match_person(cn)
                    c_dept = mp["department"] if mp else dept
                    if c_dept and c_dept not in depts_set:
                        depts_set.append(c_dept)
                    co_researchers.append({
                        "id": str(mp["id"]) if mp else "",
                        "name": mp["name"] if mp else cn,
                        "department": c_dept,
                        "isExternal": False if mp else ("ภายนอก" in cn),
                        "role": "ผู้ร่วมวิจัย",
                    })

                members = [{"role": "PI", "name": head_name, "organization": dept, "affiliation_type": "eng_kps"}]
                for cr in co_researchers:
                    members.append({
                        "role": "Co-PI",
                        "name": cr["name"],
                        "organization": cr["department"] or "คณะวิศวกรรมศาสตร์ กำแพงแสน",
                        "affiliation_type": "external" if cr.get("isExternal") else "eng_kps",
                    })

                # Collaboration & Nature
                collab_list = []
                if is_checked(collab_dom):
                    collab_list.append("ในประเทศ")
                if is_checked(collab_for):
                    collab_list.append("ต่างประเทศ")

                nature_list = []
                if is_checked(nat_str):
                    nature_list.append("สร้างความเข้มแข็ง")
                if is_checked(nat_pol):
                    nature_list.append("สอดคล้องกับนโยบาย")

                # Dates & Duration
                duration_str = ""
                s_date, _ = parse_clean_date(raw_start, default_fy)
                _, e_date = parse_clean_date(raw_end, default_fy)

                raw_start_str = clean_str(raw_start)
                if not s_date and "เดือน" in raw_start_str:
                    duration_str = raw_start_str
                    m_months = re.search(r"(\d+)", raw_start_str)
                    months_cnt = int(m_months.group(1)) if m_months else 12
                    yr_be = default_fy
                    s_date = f"{yr_be:04d}-01-01"
                    end_m = min(12, months_cnt)
                    end_d = 31 if end_m in (1, 3, 5, 7, 8, 10, 12) else 30
                    e_date = f"{yr_be:04d}-{end_m:02d}-{end_d:02d}"

                fy_be = get_fiscal_year_be(s_date, default_fy)

                # Normalize Project Code (id)
                code = re.sub(r"\s+", " ", raw_code).strip()
                if code in ("-", "–", "—", "ไม่มี"):
                    code = ""
                norm_name_key = re.sub(r"\s+", "", name).lower()

                # Check if already seen by code or normalized name
                dedup_key = norm_name_key
                existing = records_by_key.get(dedup_key)
                if not code and existing and existing.get("id"):
                    code = existing["id"]
                if not code:
                    if default_fy == 2568:
                        code = f"วศ.กพส. 68-{auto_seq_68:02d}"
                        auto_seq_68 += 1
                    else:
                        code = f"วศ.กพส. 69-{auto_seq_69:02d}"
                        auto_seq_69 += 1

                # Parse course integrations if present
                teaching_courses = []
                applied_courses = []
                if int_teach:
                    cm = re.match(r"^(\d{6,8})\s*(.*)$", int_teach)
                    if cm:
                        teaching_courses.append({"code": cm.group(1), "name": cm.group(2) or int_teach, "department": dept})
                if int_res_teach:
                    cm = re.match(r"^(\d{6,8})\s*(.*)$", int_res_teach)
                    if cm:
                        applied_courses.append({"code": cm.group(1), "name": cm.group(2) or int_res_teach, "department": dept})

                # Parse TRL
                trl_num = None
                trl_outputs = []
                if trl_raw:
                    tm = re.search(r"([1-9])", trl_raw)
                    if tm:
                        trl_num = int(tm.group(1))
                        trl_outputs.append({"name": trl_raw, "trl": trl_num})

                fund_type = "ภายนอก" if bud_ex > 0 else "ภายใน"
                sdg = detect_sdg(name, dept)

                rec = {
                    "id": code,
                    "name": name,
                    "name_en": "",
                    "head": head_name,
                    "head_id": head_id,
                    "department": dept,
                    "departments": depts_set,
                    "co_researchers": co_researchers,
                    "members": members,
                    "collaboration_type": collab_list,
                    "collaboration_domestic": clean_str(collab_dom) if is_checked(collab_dom) else "-",
                    "collaboration_foreign": clean_str(collab_for) if is_checked(collab_for) else "-",
                    "project_nature": nature_list,
                    "budget_internal": bud_in,
                    "budget_external": bud_ex,
                    "budget_total": bud_in + bud_ex,
                    "fund_source": fund_src or ("คณะวิศวกรรมศาสตร์ กำแพงแสน" if bud_in > 0 else "แหล่งทุนภายนอก"),
                    "fund_type": fund_type,
                    "start_date": s_date,
                    "end_date": e_date,
                    "duration": duration_str or (f"{s_date} ถึง {e_date}" if s_date and e_date else ""),
                    "fiscal_year_be": fy_be,
                    "integration_teaching": int_teach or "-",
                    "integration_research_teaching": int_res_teach or "-",
                    "integration_service_project": int_serv or "-",
                    "teaching_courses": teaching_courses,
                    "applied_courses": applied_courses,
                    "trl": trl_num,
                    "trl_outputs": trl_outputs,
                    "remarks": remarks_raw or "-",
                    "status": "active",
                    "sdg_code": sdg,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }
                records_by_key[dedup_key] = rec

    final_list = []
    for idx, rec in enumerate(records_by_key.values()):
        rec["_id"] = f"research_{rec['id']}"
        final_list.append(rec)
    return final_list


# ==============================================================================
# 4. ETL Domain 2: Academic Development Projects (โครงการพัฒนาวิชาการ)
# ==============================================================================
def etl_academic_projects():
    records_by_key = {}

    sources = [
        ("โครงการพัฒนาวิชาการ 2568.xlsx", None, 2568, None),
        ("1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ม.ค.2569.xlsx", ["2-โครงการพัฒนาวิชาการ"], 2569, "ม.ค."),
        ("2.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ก.พ.2569.xlsx", ["2-โครงการพัฒนาวิชาการ"], 2569, "ก.พ."),
        ("3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["2-โครงการพัฒนาวิชาการ"], 2569, "มี.ค."),
        ("4.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["2-โครงการพัฒนาวิชาการ"], 2569, "เม.ย."),
    ]

    for fname, sheets, default_fy, fixed_month in sources:
        fpath = os.path.join(EXCEL_DIR, fname)
        if not os.path.exists(fpath):
            continue
        wb = openpyxl.load_workbook(fpath, data_only=True)
        target_sheets = sheets if sheets else wb.sheetnames
        for sname in target_sheets:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]

            # Determine month from sheet name if not fixed
            sheet_month = fixed_month or ""
            if not sheet_month:
                for th_m in THAI_MONTH_ABBR[1:]:
                    if th_m in sname:
                        sheet_month = th_m
                        break

            # Find data start row (after 'เริ่มต้น'/'สิ้นสุด' subheader)
            start_row = 6
            for r in range(1, 8):
                vals = [str(ws.cell(r, c).value or "") for c in range(1, 10)]
                if any("ลำดับ" in v for v in vals):
                    start_row = r + 3
                    break

            for r in range(start_row, ws.max_row + 1):
                name = clean_str(ws.cell(r, 2).value)
                head_raw = clean_str(ws.cell(r, 3).value)
                if not name or len(name) < 3 or "ชื่อโครงการ" in name or "สรุปโครงการ" in name or "เริ่มต้น" in name:
                    continue

                co_in = int(parse_money(ws.cell(r, 4).value))
                co_ex = int(parse_money(ws.cell(r, 5).value))
                dept_raw = clean_str(ws.cell(r, 6).value)
                client_first = clean_str(ws.cell(r, 7).value)
                client_recur = clean_str(ws.cell(r, 8).value)
                budget = parse_money(ws.cell(r, 9).value)
                alloc_admin = parse_money(ws.cell(r, 10).value)
                alloc_fac = parse_money(ws.cell(r, 11).value)
                alloc_dept = parse_money(ws.cell(r, 12).value)
                alloc_ku = parse_money(ws.cell(r, 13).value)
                res_int_raw = clean_str(ws.cell(r, 14).value)
                pat_int_raw = clean_str(ws.cell(r, 15).value)
                nat_pol_raw = ws.cell(r, 16).value
                nat_val_raw = ws.cell(r, 17).value
                s_date_raw = ws.cell(r, 18).value
                e_date_raw = ws.cell(r, 19).value
                int_s_raw = ws.cell(r, 20).value
                int_e_raw = ws.cell(r, 21).value
                rec_no = clean_str(ws.cell(r, 22).value)
                if rec_no in ("-", "–", "—"):
                    rec_no = ""
                remarks = clean_str(ws.cell(r, 23).value) if ws.max_column >= 23 else ""
                status_raw = clean_str(ws.cell(r, 24).value) if ws.max_column >= 24 else ""

                matched_head = match_person(head_raw)
                head_name = matched_head["name"] if matched_head else head_raw
                head_id = matched_head["id"] if matched_head else None
                dept = normalize_department(dept_raw, matched_head["department"] if matched_head else "คณะวิศวกรรมศาสตร์ กำแพงแสน")

                # Client & frequency
                client = ""
                client_freq = ""
                if client_first and client_first not in ("ü", "P", "ใช่"):
                    client = client_first
                    client_freq = "ครั้งแรก"
                elif client_recur and client_recur not in ("ü", "P", "ใช่"):
                    client = client_recur
                    client_freq = "มากกว่า 1 ครั้ง"
                elif is_checked(client_first):
                    client_freq = "ครั้งแรก"
                elif is_checked(client_recur):
                    client_freq = "มากกว่า 1 ครั้ง"

                # Characteristics
                chars = []
                if is_checked(nat_pol_raw):
                    chars.append("สอดคล้องกับนโยบายชาติ")
                if is_checked(nat_val_raw):
                    chars.append("เพิ่มมูลค่า")

                # Research integration
                research_projects = []
                if res_int_raw:
                    cm = re.match(r"^([A-Za-z0-9\.\-/]+)\s+(.*)$", res_int_raw)
                    if cm:
                        research_projects.append({"code": cm.group(1), "name": cm.group(2)})
                    else:
                        research_projects.append({"code": "-", "name": res_int_raw})

                s_date, _ = parse_clean_date(s_date_raw, default_fy)
                _, e_date = parse_clean_date(e_date_raw, default_fy)
                int_s, _ = parse_clean_date(int_s_raw, default_fy)
                _, int_e = parse_clean_date(int_e_raw, default_fy)

                fy_be = get_fiscal_year_be(s_date, default_fy)

                # Allocations
                if budget > 0 and alloc_fac == 0:
                    alloc_fac = round(budget * 0.05, 2)
                if budget > 0 and alloc_dept == 0:
                    alloc_dept = round(budget * 0.05, 2)
                if budget > 0 and alloc_ku == 0:
                    alloc_ku = round(budget * 0.05, 2)
                if budget > 0 and alloc_admin == 0:
                    alloc_admin = round(alloc_fac + alloc_dept + alloc_ku, 2)

                norm_name = re.sub(r"\s+", "", name).lower()
                dedup_key = f"{norm_name}_{rec_no or s_date}"
                rec = {
                    "id": rec_no or f"AC-{fy_be}-{len(records_by_key)+1:03d}",
                    "name": name,
                    "head": head_name,
                    "head_id": head_id,
                    "department": dept,
                    "co_members_internal": co_in,
                    "co_members_external": co_ex,
                    "client": client or "-",
                    "client_frequency": client_freq,
                    "client_first_time": client_first or ("ใช่" if client_freq == "ครั้งแรก" else "-"),
                    "client_recurring": client_recur or ("ใช่" if client_freq == "มากกว่า 1 ครั้ง" else "-"),
                    "budget": budget,
                    "percent_faculty": 5,
                    "percent_dept": 5,
                    "percent_ku": 5,
                    "alloc_faculty": alloc_fac,
                    "alloc_dept": alloc_dept,
                    "alloc_ku": alloc_ku,
                    "alloc_total": alloc_admin,
                    "research_projects": research_projects,
                    "patent_integration": pat_int_raw,
                    "characteristics": chars,
                    "start_date": s_date,
                    "end_date": e_date,
                    "integration_start_date": int_s,
                    "integration_end_date": int_e,
                    "record_number": rec_no,
                    "remarks": remarks or status_raw,
                    "month": sheet_month,
                    "fiscal_year_be": fy_be,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }
                records_by_key[dedup_key] = rec

    final_list = []
    for idx, rec in enumerate(records_by_key.values()):
        rec["_id"] = f"academic_{idx + 1}"
        final_list.append(rec)
    return final_list


# ==============================================================================
# 5. ETL Domain 3: Academic Services (งานบริการวิชาการ)
# ==============================================================================
SERVICE_TYPE_COLS = [
    (4, "วิทยากร/อาจารย์พิเศษ"),
    (5, "วิชาการ"),
    (6, "วิชาชีพ"),
    (7, "ผู้ทรงคุณวุฒิ"),
    (8, "วิทยานิพนธ์ภายนอก"),
    (9, "ศึกษาดูงาน วศ.กพส."),
]


def etl_academic_services():
    records_by_key = {}

    sources = [
        ("งานบริการวิชาการ 2568.xlsx", ["รวม68"], 2568, None),
        ("1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ม.ค.2569.xlsx", ["3-งานบริการวิชาการ"], 2569, "ม.ค."),
        ("2.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ก.พ.2569.xlsx", ["3-งานบริการวิชาการ"], 2569, "ก.พ."),
        ("3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["3-งานบริการวิชาการ"], 2569, "มี.ค."),
        ("4.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["3-งานบริการวิชาการ"], 2569, "เม.ย."),
        ("5.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["3-ผลงานบริการ"], 2569, "พ.ค."),
    ]

    for fname, sheets, default_fy, fixed_month in sources:
        fpath = os.path.join(EXCEL_DIR, fname)
        if not os.path.exists(fpath):
            continue
        wb = openpyxl.load_workbook(fpath, data_only=True)
        for sname in sheets:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]

            start_row = 4
            for r in range(1, 7):
                vals = [str(ws.cell(r, c).value or "") for c in range(1, 10)]
                if any("ลำดับ" in v for v in vals):
                    start_row = r + 2
                    break

            current_section_month = fixed_month or ""
            for r in range(start_row, ws.max_row + 1):
                c1 = ws.cell(r, 1).value
                # In รวม68, separator rows have a datetime in col 1 and None in col 2
                if isinstance(c1, (datetime.datetime, datetime.date)) and not ws.cell(r, 2).value:
                    current_section_month = THAI_MONTH_ABBR[c1.month]
                    continue

                name = clean_str(ws.cell(r, 2).value)
                target_group = clean_str(ws.cell(r, 3).value)
                person_raw = clean_str(ws.cell(r, 10).value)
                dept_raw = clean_str(ws.cell(r, 11).value)
                date_raw = ws.cell(r, 12).value
                hours_raw = ws.cell(r, 13).value
                attendees_raw = ws.cell(r, 14).value
                remarks_raw = clean_str(ws.cell(r, 15).value) if ws.max_column >= 15 else ""

                if not name or len(name) < 2 or "เรื่อง" == name or "สรุปข้อมูล" in name:
                    continue

                # Determine service type from cols 4..9
                s_type = "วิชาการ"
                for col_idx, label in SERVICE_TYPE_COLS:
                    if is_checked(ws.cell(r, col_idx).value):
                        s_type = label
                        break

                matched_p = match_person(person_raw)
                person_name = matched_p["name"] if matched_p else person_raw
                person_id = matched_p["id"] if matched_p else None
                prefix, _, _ = extract_prefix_and_clean(person_name)
                dept = normalize_department(dept_raw, matched_p["department"] if matched_p else "คณะวิศวกรรมศาสตร์ กำแพงแสน")

                s_date, e_date = parse_clean_date(date_raw, default_fy)
                if not s_date and current_section_month in THAI_MONTH_MAP:
                    m_num = THAI_MONTH_MAP[current_section_month]
                    yr_be = default_fy
                    s_date = f"{yr_be:04d}-{m_num:02d}-01"
                    e_date = s_date

                fy_be = get_fiscal_year_be(s_date, default_fy)
                hours = parse_money(hours_raw) if hours_raw is not None and clean_str(hours_raw) != "" else None
                attendees = int(parse_money(attendees_raw)) if attendees_raw is not None and clean_str(attendees_raw) != "" else None

                norm_name = re.sub(r"\s+", "", name).lower()
                norm_person = re.sub(r"\s+", "", person_name).lower()
                dedup_key = f"{norm_name}_{norm_person}_{s_date}"
                rec = {
                    "date": s_date,
                    "start_date": s_date,
                    "end_date": e_date or s_date,
                    "name": name,
                    "topic_title": name,
                    "service_type": s_type,
                    "service_category": s_type,
                    "person": person_name,
                    "person_id": person_id,
                    "prefix": matched_p.get("title_th", prefix) if matched_p else prefix,
                    "department": dept,
                    "target_group": target_group,
                    "hours_spent": hours if (hours and hours > 0) else None,
                    "attendees_count": attendees if (attendees and attendees > 0) else None,
                    "remarks": remarks_raw,
                    "month": current_section_month,
                    "fiscal_year_be": fy_be,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }
                records_by_key[dedup_key] = rec

    final_list = []
    for idx, rec in enumerate(records_by_key.values()):
        rec["_id"] = f"service_{idx + 1}"
        final_list.append(rec)
    return final_list


# ==============================================================================
# 6. ETL Domain 4: Academic Publications (ผลงานตีพิมพ์ทางวิชาการ)
# ==============================================================================
def normalize_pub_type(raw_t: str, journal_raw: str = "") -> str:
    s = clean_str(raw_t)
    j = clean_str(journal_raw)
    if "อนุสิทธิบัตร" in s or "สิทธิบัตร" in s or ("เตรียม" in s and ("อนุสิทธิบัตร" in j or "สิทธิบัตร" in j)):
        return "เตรียมความพร้อมจดอนุสิทธิบัตร"
    if "เตรียม" in s:
        return "เตรียมความพร้อมตีพิมพ์"
    return "ตีพิมพ์"


def normalize_pub_level(raw_l: str) -> str:
    s = clean_str(raw_l)
    if "นานาชาติ" in s or "inter" in s.lower():
        return "นานาชาติ"
    return "ชาติ"


def etl_publications():
    records_by_key = {}

    sources = [
        ("ผลงานทางวิชาการ 2568.xlsx", ["รวม68", "ม.ค.68", "เม.ย.68", "พ.ค.68 ", "มิ.ย.68", "ก.ค.68", "ส.ค.68", "ก.ย.68", "ต.ค.68", "พ.ย.68 ", "ธ.ค.68"], 2568, None),
        ("1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ม.ค.2569.xlsx", ["4-ผลงานทางวิชาการ"], 2569, "ม.ค."),
        ("3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["4-ผลงานทางวิชาการ"], 2569, "มี.ค."),
        ("4.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["4-ผลงานทางวิชาการ"], 2569, "เม.ย."),
        ("5.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["4-ผลงานทางวิชาการ"], 2569, "พ.ค."),
    ]

    for fname, sheets, default_fy, fixed_month in sources:
        fpath = os.path.join(EXCEL_DIR, fname)
        if not os.path.exists(fpath):
            continue
        wb = openpyxl.load_workbook(fpath, data_only=True)
        for sname in sheets:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]

            sheet_month = fixed_month or ""
            if not sheet_month:
                for th_m in THAI_MONTH_ABBR[1:]:
                    if th_m in sname:
                        sheet_month = th_m
                        break

            start_row = 4
            for r in range(1, 7):
                vals = [str(ws.cell(r, c).value or "") for c in range(1, 10)]
                if any("ลำดับ" in v for v in vals):
                    start_row = r + 2
                    break

            current_section_month = sheet_month or "ม.ค."
            for r in range(start_row, ws.max_row + 1):
                c1 = ws.cell(r, 1).value
                if isinstance(c1, (datetime.datetime, datetime.date)) and not ws.cell(r, 2).value:
                    current_section_month = THAI_MONTH_ABBR[c1.month]
                    continue

                name = clean_str(ws.cell(r, 2).value)
                type_raw = clean_str(ws.cell(r, 3).value)
                level_raw = clean_str(ws.cell(r, 4).value)
                budget = parse_money(ws.cell(r, 5).value)
                owner_raw = clean_str(ws.cell(r, 6).value)
                co_for_raw = ws.cell(r, 7).value
                co_dom_raw = ws.cell(r, 8).value
                dept_raw = clean_str(ws.cell(r, 9).value)
                journal_raw = clean_str(ws.cell(r, 10).value)
                vol_raw = clean_str(ws.cell(r, 11).value)
                issue_raw = clean_str(ws.cell(r, 12).value) if ws.max_column >= 12 else ""
                p_start_raw = clean_str(ws.cell(r, 13).value) if ws.max_column >= 13 else ""
                p_end_raw = clean_str(ws.cell(r, 14).value) if ws.max_column >= 14 else ""
                remarks_raw = clean_str(ws.cell(r, 15).value) if ws.max_column >= 15 else ""

                if not name or len(name) < 3 or "ชื่อผลงาน" in name or "สรุปข้อมูล" in name:
                    continue

                pub_type = normalize_pub_type(type_raw, journal_raw)
                pub_level = normalize_pub_level(level_raw)

                matched_owner = match_person(owner_raw)
                owner_name = matched_owner["name"] if matched_owner else owner_raw
                owner_id = matched_owner["id"] if matched_owner else None
                dept = normalize_department(dept_raw, matched_owner["department"] if matched_owner else "คณะวิศวกรรมศาสตร์ กำแพงแสน")

                co_foreign = split_people_names(co_for_raw)
                co_domestic = split_people_names(co_dom_raw)

                m_num = THAI_MONTH_MAP.get(current_section_month, 1)
                be_year = default_fy if m_num < 10 else (default_fy - 1)
                month_year = f"{be_year:04d}-{m_num:02d}"
                if vol_raw in ("2024", "2025", "2026"):
                    vol_raw = str(int(vol_raw) + 543)
                if journal_raw:
                    journal_raw = re.sub(r"\b(202[0-9])\b", lambda m: str(int(m.group(1)) + 543), journal_raw)

                # Detect quartile from remarks
                quartile = ""
                for q in ("Q1", "Q2", "Q3", "Q4", "TCI1", "TCI2"):
                    if q.lower() in remarks_raw.lower():
                        quartile = q
                        break

                norm_name = re.sub(r"\s+", "", name).lower()
                norm_owner = re.sub(r"\s+", "", owner_name).lower()
                dedup_key = f"{norm_name}_{pub_type}_{norm_owner}"
                rec = {
                    "name": name,
                    "type": pub_type,
                    "level": pub_level,
                    "budget": budget,
                    "owner": owner_name,
                    "owner_id": owner_id,
                    "person_id": owner_id,
                    "co_authors_foreign": co_foreign,
                    "co_authors_domestic": co_domestic,
                    "department": dept,
                    "journal": journal_raw or ("อนุสิทธิบัตร" if pub_type == "เตรียมความพร้อมจดอนุสิทธิบัตร" else "-"),
                    "volume": vol_raw,
                    "issue": issue_raw,
                    "page_start": p_start_raw,
                    "page_end": p_end_raw,
                    "quartile": quartile,
                    "remarks": remarks_raw,
                    "month": current_section_month,
                    "month_year": month_year,
                    "fiscal_year_be": default_fy,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }
                records_by_key[dedup_key] = rec

    final_list = []
    for idx, rec in enumerate(records_by_key.values()):
        pub_id = f"pub_{idx + 1:03d}"
        rec["id"] = pub_id
        rec["_id"] = f"publications_{pub_id}"
        final_list.append(rec)
    return final_list


# ==============================================================================
# 7. ETL Domain 5: Intellectual Property (งานทรัพย์สินทางปัญญา)
# ==============================================================================
# Retired / Emeritus KU Engineering KPS faculty department fallback map
EMERITUS_DEPT_MAP = {
    "อนุพันธ์ เทอดวงศ์วรกุล": "ภาควิชาวิศวกรรมเกษตร",
    "มงคล กวางวโรภาส": "ภาควิชาวิศวกรรมเกษตร",
    "วิชา หมั่นทำการ": "ภาควิชาวิศวกรรมเกษตร",
    "บัณฑิต จริโมภาส": "ภาควิชาวิศวกรรมเกษตร",
    "ง่ายงาม ประจวบวัน": "ภาควิชาวิศวกรรมเกษตร",
    "ประภาศรี สิงหรัตน์": "ภาควิชาวิศวกรรมเกษตร",
    "รังสินี โสธรวิทย์": "ภาควิชาวิศวกรรมการอาหาร",
    "เชาว์ อินทร์ประสิทธิ์": "ภาควิชาวิศวกรรมการอาหาร",
    "มนต์ทิพย์ ช่ำชอง": "ภาควิชาวิศวกรรมการอาหาร",
    "ปาริฉัตร เสริมวุฒิสาร": "ภาควิชาวิศวกรรมอุตสาหการ",
    "ระวี อยู่สำราญ": "ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ",
}


def build_inventors_and_depts(raw_creator: str, raw_dept: str = ""):
    names = split_people_names(raw_creator)
    inventors = []
    depts = []
    first_person_id = None

    if raw_dept:
        norm_d = normalize_department(raw_dept)
        for d in norm_d.split(","):
            d_clean = d.strip()
            if d_clean and d_clean not in depts:
                depts.append(d_clean)

    for n in names:
        mp = match_person(n)
        if mp:
            if not first_person_id:
                first_person_id = mp["id"]
            p_dept = mp.get("department", "")
            if p_dept and p_dept not in depts:
                depts.append(p_dept)
            inventors.append({
                "name": mp["name"],
                "person_id": mp["id"],
                "department": p_dept or (depts[0] if depts else ""),
            })
        else:
            fallback_dept = ""
            for em_name, em_dept in EMERITUS_DEPT_MAP.items():
                if em_name in n:
                    fallback_dept = em_dept
                    if em_dept not in depts:
                        depts.append(em_dept)
                    break
            inventors.append({
                "name": n,
                "person_id": None,
                "department": fallback_dept or (depts[0] if depts else ""),
            })

    if not depts:
        depts = ["คณะวิศวกรรมศาสตร์ กำแพงแสน"]

    creator_str = ", ".join(i["name"] for i in inventors) if inventors else clean_str(raw_creator)
    return inventors, creator_str, depts, ", ".join(depts), first_person_id


def etl_intellectual_property():
    records_by_key = {}

    # 7.1 Load Cumulative IP file: ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx
    cum_path = os.path.join(EXCEL_DIR, "ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx")
    if os.path.exists(cum_path):
        wb = openpyxl.load_workbook(cum_path, data_only=True)
        # Sheets: สิทธิบัตร, อนุสิทธิบัตร, อนุสิทธิบัตร-เก่า
        for sname, ip_type in [("สิทธิบัตร", "สิทธิบัตร"), ("อนุสิทธิบัตร", "อนุสิทธิบัตร"), ("อนุสิทธิบัตร-เก่า", "อนุสิทธิบัตร")]:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]
            for r in range(3, ws.max_row + 1):
                title = clean_str(ws.cell(r, 2).value)
                creator_raw = clean_str(ws.cell(r, 3).value)
                reg_raw = clean_str(ws.cell(r, 4).value)
                app_raw = clean_str(ws.cell(r, 5).value)
                filing_raw = ws.cell(r, 6).value
                year_granted = ws.cell(r, 7).value
                prot_start_raw = ws.cell(r, 8).value
                prot_end_raw = ws.cell(r, 9).value
                level_raw = clean_str(ws.cell(r, 10).value)

                if not title or len(title) < 3 or "รายชื่อ" in title:
                    continue

                inventors, creator_str, depts, dept_str, pid = build_inventors_and_depts(creator_raw)
                yg_be = to_year_be(int(year_granted)) if isinstance(year_granted, (int, float)) else 2563
                f_date, _ = parse_clean_date(filing_raw, yg_be)
                p_start, _ = parse_clean_date(prot_start_raw, yg_be)
                _, p_end = parse_clean_date(prot_end_raw, yg_be + 6)

                app_no = re.sub(r"\.0$", "", app_raw)
                reg_no = re.sub(r"\.0$", "", reg_raw)
                if app_no in ("-", "–", "—"):
                    app_no = ""
                if reg_no in ("-", "–", "—"):
                    reg_no = ""
                req_no = f"{app_no} / {reg_no}" if (app_no and reg_no) else (app_no or reg_no)

                yr_be = yg_be if isinstance(year_granted, (int, float)) else get_fiscal_year_be(p_start or f_date, 2568)

                dedup_key = reg_no or app_no or re.sub(r"\s+", "", title).lower()
                if sname == "อนุสิทธิบัตร-เก่า" and dedup_key in records_by_key:
                    continue

                records_by_key[dedup_key] = {
                    "title": title,
                    "name": title,
                    "type": ip_type,
                    "inventors": inventors,
                    "creator": creator_str,
                    "department": dept_str,
                    "departments": depts,
                    "filing_date": f_date,
                    "application_number": app_no,
                    "registration_number": reg_no,
                    "protection_start": p_start,
                    "protection_end": p_end,
                    "support_amount": 0,
                    "remarks": f"ปีที่ได้รับ พ.ศ. {yg_be} ({level_raw})" if isinstance(year_granted, (int, float)) else level_raw,
                    "req_no": req_no,
                    "status": "ได้รับความคุ้มครองแล้ว" if (reg_no or p_start) else "ยื่นคำขอแล้ว",
                    "person_id": pid,
                    "fiscal_year_be": yr_be,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }

        # Sheet: ลิขสิทธิ์
        if "ลิขสิทธิ์" in wb.sheetnames:
            ws = wb["ลิขสิทธิ์"]
            for r in range(3, ws.max_row + 1):
                title = clean_str(ws.cell(r, 2).value)
                work_subtype = clean_str(ws.cell(r, 3).value)
                creator_raw = clean_str(ws.cell(r, 4).value)
                reg_raw = clean_str(ws.cell(r, 5).value)
                app_raw = clean_str(ws.cell(r, 6).value)
                filing_raw = ws.cell(r, 7).value
                issue_raw = ws.cell(r, 8).value

                if not title or len(title) < 3 or "ชื่อผลงาน" in title:
                    continue

                inventors, creator_str, depts, dept_str, pid = build_inventors_and_depts(creator_raw)
                f_date, _ = parse_clean_date(filing_raw, 2568)
                p_start, _ = parse_clean_date(issue_raw, 2568)
                app_no = re.sub(r"\.0$", "", app_raw)
                reg_no = re.sub(r"\.0$", "", reg_raw)
                if app_no in ("-", "–", "—"):
                    app_no = ""
                if reg_no in ("-", "–", "—"):
                    reg_no = ""
                req_no = f"{app_no} / {reg_no}" if (app_no and reg_no) else (app_no or reg_no)

                dedup_key = reg_no or app_no or re.sub(r"\s+", "", title).lower()
                records_by_key[dedup_key] = {
                    "title": title,
                    "name": title,
                    "type": "ลิขสิทธิ์",
                    "inventors": inventors,
                    "creator": creator_str,
                    "department": dept_str,
                    "departments": depts,
                    "filing_date": f_date,
                    "application_number": app_no,
                    "registration_number": reg_no,
                    "protection_start": p_start,
                    "protection_end": "",
                    "support_amount": 0,
                    "remarks": work_subtype,
                    "req_no": req_no,
                    "status": "ได้รับความคุ้มครองแล้ว" if (reg_no or p_start) else "ยื่นคำขอแล้ว",
                    "person_id": pid,
                    "fiscal_year_be": get_fiscal_year_be(p_start or f_date, 2568),
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }

    # 7.2 Load 2568 & 2569 Monthly IP Reports (merges support_amount & new applications)
    monthly_sources = [
        ("งานทรัพสินทางปัญญา 2568.xlsx", ["รวม68", "มี.ค.68", "พ.ค.68", "มิ.ย.68", "ก.ค.68", "พ.ย.68"], 2568),
        ("1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล.ม.ค.2569.xlsx", ["5-งานทรัพย์สินทางปัญญา"], 2569),
        ("3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx", ["5-งานทรัพย์สินทางปัญญา"], 2569),
    ]

    for fname, sheets, default_fy in monthly_sources:
        fpath = os.path.join(EXCEL_DIR, fname)
        if not os.path.exists(fpath):
            continue
        wb = openpyxl.load_workbook(fpath, data_only=True)
        for sname in sheets:
            if sname not in wb.sheetnames:
                continue
            ws = wb[sname]

            start_row = 4
            for r in range(1, 8):
                vals = [str(ws.cell(r, c).value or "") for c in range(1, 10)]
                if any("ลำดับ" in v for v in vals):
                    start_row = r + 2
                    break

            for r in range(start_row, ws.max_row + 1):
                c1 = ws.cell(r, 1).value
                if isinstance(c1, (datetime.datetime, datetime.date)) and not ws.cell(r, 2).value:
                    continue

                title = clean_str(ws.cell(r, 2).value)
                creator_raw = clean_str(ws.cell(r, 3).value)
                dept_raw = clean_str(ws.cell(r, 4).value)
                is_petty = is_checked(ws.cell(r, 5).value)
                is_patent = is_checked(ws.cell(r, 6).value)
                filing_raw = ws.cell(r, 7).value
                app_raw = clean_str(ws.cell(r, 8).value)
                reg_raw = clean_str(ws.cell(r, 9).value)

                # Note: some sheets have 2 columns for protection period (10 & 11) and support in col 12,
                # while others have 1 column for protection period (10) and support in col 11.
                col11_header = str(ws.cell(start_row - 2, 11).value or "") + str(ws.cell(start_row - 1, 11).value or "")
                if "สนับสนุน" in col11_header:
                    prot_s_raw = ws.cell(r, 10).value
                    prot_e_raw = None
                    support_val = parse_money(ws.cell(r, 11).value)
                    remarks_val = clean_str(ws.cell(r, 12).value)
                else:
                    prot_s_raw = ws.cell(r, 10).value
                    prot_e_raw = ws.cell(r, 11).value
                    support_val = parse_money(ws.cell(r, 12).value) if ws.max_column >= 12 else 0.0
                    remarks_val = clean_str(ws.cell(r, 13).value) if ws.max_column >= 13 else ""

                if not title or len(title) < 3 or "เรื่อง" == title or "สรุป" in title:
                    continue

                ip_type = "สิทธิบัตร" if (is_patent and not is_petty) else "อนุสิทธิบัตร"
                inventors, creator_str, depts, dept_str, pid = build_inventors_and_depts(creator_raw, dept_raw)

                f_date, _ = parse_clean_date(filing_raw, default_fy)
                p_start, p_end = parse_clean_date(prot_s_raw, default_fy)
                if prot_e_raw:
                    _, p_end2 = parse_clean_date(prot_e_raw, default_fy)
                    if p_end2:
                        p_end = p_end2

                app_no = re.sub(r"\.0$", "", app_raw)
                reg_no = re.sub(r"\.0$", "", reg_raw)
                if app_no in ("-", "–", "—"):
                    app_no = ""
                if reg_no in ("-", "–", "—"):
                    reg_no = ""
                req_no = f"{app_no} / {reg_no}" if (app_no and reg_no) else (app_no or reg_no)

                # Match existing record by reg_no, app_no, or normalized title
                norm_title = re.sub(r"\s+", "", title).lower()
                matched_key = None
                for k, ex in records_by_key.items():
                    if (reg_no and ex["registration_number"] == reg_no) or (app_no and ex["application_number"] == app_no) or re.sub(r"\s+", "", ex["title"]).lower() == norm_title:
                        matched_key = k
                        break

                rec = {
                    "title": title,
                    "name": title,
                    "type": ip_type,
                    "inventors": inventors,
                    "creator": creator_str,
                    "department": dept_str,
                    "departments": depts,
                    "filing_date": f_date,
                    "application_number": app_no,
                    "registration_number": reg_no,
                    "protection_start": p_start,
                    "protection_end": p_end,
                    "support_amount": support_val,
                    "remarks": remarks_val,
                    "req_no": req_no,
                    "status": "ได้รับความคุ้มครองแล้ว" if (reg_no or p_start) else "ยื่นคำขอแล้ว",
                    "person_id": pid,
                    "fiscal_year_be": default_fy,
                    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                }

                if matched_key:
                    ex = records_by_key[matched_key]
                    if support_val > 0:
                        ex["support_amount"] = support_val
                    if remarks_val:
                        ex["remarks"] = remarks_val
                    if f_date and not ex["filing_date"]:
                        ex["filing_date"] = f_date
                    if p_start and not ex["protection_start"]:
                        ex["protection_start"] = p_start
                    if p_end and not ex["protection_end"]:
                        ex["protection_end"] = p_end
                    if app_no and not ex["application_number"]:
                        ex["application_number"] = app_no
                    if reg_no and not ex["registration_number"]:
                        ex["registration_number"] = reg_no
                    if len(inventors) > len(ex.get("inventors", [])):
                        ex["inventors"] = inventors
                        ex["creator"] = creator_str
                    if dept_str and (ex.get("department") == "คณะวิศวกรรมศาสตร์ กำแพงแสน" or len(depts) > len(ex.get("departments", []))):
                        ex["department"] = dept_str
                        ex["departments"] = depts
                    ex["fiscal_year_be"] = default_fy
                else:
                    dedup_key = reg_no or app_no or norm_title
                    records_by_key[dedup_key] = rec

    final_list = []
    for idx, rec in enumerate(records_by_key.values()):
        ip_id = f"ip_{idx + 1}"
        rec["id"] = ip_id
        rec["_id"] = ip_id
        final_list.append(rec)
    return final_list


# ==============================================================================
# 8. ETL Domain 6: Strategic KPIs (หน่วยวิจัยและนวัตกรรม-แบบรายงานผลตัวชี้ว.xlsx)
# ==============================================================================
def etl_strategic_kpis():
    fpath = os.path.join(EXCEL_DIR, "หน่วยวิจัยและนวัตกรรม-แบบรายงานผลตัวชี้ว.xlsx")
    if not os.path.exists(fpath):
        return []
    wb = openpyxl.load_workbook(fpath, data_only=True)
    sname = "คณะวิศวกรรมศาสตร์" if "คณะวิศวกรรมศาสตร์" in wb.sheetnames else wb.sheetnames[0]
    ws = wb[sname]

    kpis = []
    current_strategy = ""
    current_plan = ""

    for r in range(8, ws.max_row + 1):
        strat = clean_str(ws.cell(r, 1).value)
        plan = clean_str(ws.cell(r, 2).value)
        title = clean_str(ws.cell(r, 3).value)
        desc = clean_str(ws.cell(r, 4).value)
        period = clean_str(ws.cell(r, 5).value)
        unit = clean_str(ws.cell(r, 6).value)
        target_raw = ws.cell(r, 7).value
        actual_raw = ws.cell(r, 8).value
        responsible = clean_str(ws.cell(r, 11).value) if ws.max_column >= 11 else ""
        reporter = clean_str(ws.cell(r, 12).value) if ws.max_column >= 12 else ""

        if strat:
            current_strategy = strat
        if plan:
            current_plan = plan
        if not title or "ตัวชี้วัด" in title:
            continue

        target_num = parse_money(target_raw)
        actual_num = parse_money(actual_raw)
        if target_num <= 0 and actual_num <= 0 and title.startswith("-"):
            continue

        kpis.append({
            "id": f"ku_kpi_{len(kpis)+1:02d}",
            "strategy": current_strategy,
            "plan": current_plan,
            "title": title,
            "description": desc,
            "period": period or "ปีงบประมาณ",
            "unit": unit or "รายการ",
            "targetValue": target_num,
            "actualValue": actual_num,
            "responsibleUnit": responsible or "คณะวิศวกรรมศาสตร์ กำแพงแสน",
            "reporter": reporter,
            "fiscalYear": "2569",
        })
    return kpis


# ==============================================================================
# 9. Run All ETL Pipelines & Save JSON Files
# ==============================================================================
def save_pair(base_name: str, data: list):
    p1 = os.path.join(OUT_DIR, f"{base_name}.json")
    p2 = os.path.join(OUT_DIR, f"persisted_{base_name}.json")
    content = json.dumps(data, ensure_ascii=False, indent=2)
    with open(p1, "w", encoding="utf-8") as f:
        f.write(content)
    with open(p2, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[OK] Saved {base_name}.json & persisted_{base_name}.json ({len(data)} records)")


def main():
    print("=== Running Complete KU Engineering ETL Pipeline ===")
    save_pair("personnel", cleaned_personnel)

    research_list = etl_research_projects()
    save_pair("research", research_list)

    # Sync funding_sources.json from research projects
    funding_map = {}
    for r in research_list:
        src = r.get("fund_source", "").strip()
        if src and src != "-":
            funding_map[src.lower()] = {
                "id": f"fund_{len(funding_map)+1:02d}",
                "name": src,
                "type": r.get("fund_type", "ภายนอก"),
            }
    with open(os.path.join(OUT_DIR, "funding_sources.json"), "w", encoding="utf-8") as f:
        json.dump(list(funding_map.values()), f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved funding_sources.json ({len(funding_map)} sources)")

    academic_list = etl_academic_projects()
    save_pair("academic", academic_list)

    services_list = etl_academic_services()
    save_pair("services", services_list)

    publications_list = etl_publications()
    save_pair("publications", publications_list)

    ip_list = etl_intellectual_property()
    save_pair("ip", ip_list)

    kpi_list = etl_strategic_kpis()
    with open(os.path.join(OUT_DIR, "strategic_kpis.json"), "w", encoding="utf-8") as f:
        json.dump(kpi_list, f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved strategic_kpis.json ({len(kpi_list)} KPIs)")


if __name__ == "__main__":
    main()
