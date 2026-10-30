export type JournalTier = 
  | 'Q1' 
  | 'Q2' 
  | 'Q3' 
  | 'Q4' 
  | 'TCI 1' 
  | 'TCI 2' 
  | 'International Conference' 
  | 'National Conference';

export interface JournalIndexEntry {
  title: string;
  normalizedTitle: string;
  tier: JournalTier;
  database: 'Scopus' | 'TCI' | 'Conference';
  issn?: string;
  publisher?: string;
}

export const KNOWN_JOURNALS_INDEX: JournalIndexEntry[] = [
  // Q1
  { title: 'Computers and Electronics in Agriculture', normalizedTitle: 'computers and electronics in agriculture', tier: 'Q1', database: 'Scopus', issn: '0168-1699', publisher: 'Elsevier' },
  { title: 'Energy and Buildings', normalizedTitle: 'energy and buildings', tier: 'Q1', database: 'Scopus', issn: '0378-7788', publisher: 'Elsevier' },
  { title: 'Biosystems Engineering', normalizedTitle: 'biosystems engineering', tier: 'Q1', database: 'Scopus', issn: '1537-5110', publisher: 'Elsevier' },
  { title: 'Agricultural Water Management', normalizedTitle: 'agricultural water management', tier: 'Q1', database: 'Scopus', issn: '0378-3774', publisher: 'Elsevier' },
  { title: 'Journal of Cleaner Production', normalizedTitle: 'journal of cleaner production', tier: 'Q1', database: 'Scopus', issn: '0959-6526', publisher: 'Elsevier' },
  { title: 'Building and Environment', normalizedTitle: 'building and environment', tier: 'Q1', database: 'Scopus', issn: '0360-1323', publisher: 'Elsevier' },
  { title: 'Renewable Energy', normalizedTitle: 'renewable energy', tier: 'Q1', database: 'Scopus', issn: '0960-1481', publisher: 'Elsevier' },
  { title: 'IEEE Transactions on Industrial Informatics', normalizedTitle: 'ieee transactions on industrial informatics', tier: 'Q1', database: 'Scopus', issn: '1551-3203', publisher: 'IEEE' },
  { title: 'Water Resources Management', normalizedTitle: 'water resources management', tier: 'Q1', database: 'Scopus', issn: '0920-4741', publisher: 'Springer' },
  { title: 'Journal of Food Engineering', normalizedTitle: 'journal of food engineering', tier: 'Q1', database: 'Scopus', issn: '0260-8774', publisher: 'Elsevier' },
  { title: 'Precision Agriculture', normalizedTitle: 'precision agriculture', tier: 'Q1', database: 'Scopus', issn: '1385-2256', publisher: 'Springer' },

  // Q2
  { title: 'AgriEngineering', normalizedTitle: 'agriengineering', tier: 'Q2', database: 'Scopus', issn: '2624-7402', publisher: 'MDPI' },
  { title: 'International Journal of Agricultural and Biological Engineering', normalizedTitle: 'international journal of agricultural and biological engineering', tier: 'Q2', database: 'Scopus', issn: '1934-6344' },
  { title: 'Agriculture', normalizedTitle: 'agriculture', tier: 'Q2', database: 'Scopus', issn: '2077-0472', publisher: 'MDPI' },
  { title: 'Sensors', normalizedTitle: 'sensors', tier: 'Q2', database: 'Scopus', issn: '1424-8220', publisher: 'MDPI' },
  { title: 'Applied Sciences', normalizedTitle: 'applied sciences', tier: 'Q2', database: 'Scopus', issn: '2076-3417', publisher: 'MDPI' },
  { title: 'Water', normalizedTitle: 'water', tier: 'Q2', database: 'Scopus', issn: '2073-4441', publisher: 'MDPI' },
  { title: 'Sustainability', normalizedTitle: 'sustainability', tier: 'Q2', database: 'Scopus', issn: '2071-1050', publisher: 'MDPI' },
  { title: 'Engineering Structures', normalizedTitle: 'engineering structures', tier: 'Q2', database: 'Scopus', issn: '0141-0296' },

  // Q3 & Q4
  { title: 'International Journal of Agricultural Technology', normalizedTitle: 'international journal of agricultural technology', tier: 'Q3', database: 'Scopus', issn: '2630-0192' },
  { title: 'Engineering and Applied Science Research', normalizedTitle: 'engineering and applied science research', tier: 'Q3', database: 'Scopus', issn: '2586-9000' },
  { title: 'Journal of Engineering Science and Technology', normalizedTitle: 'journal of engineering science and technology', tier: 'Q3', database: 'Scopus', issn: '1823-4690' },
  { title: 'Suranaree Journal of Science and Technology', normalizedTitle: 'suranaree journal of science and technology', tier: 'Q4', database: 'Scopus', issn: '0858-849X' },
  { title: 'Science, Engineering and Health Studies', normalizedTitle: 'science engineering and health studies', tier: 'Q4', database: 'Scopus', issn: '2630-0087' },

  // TCI Tier 1 (ศูนย์ดัชนีการอ้างอิงวารสารไทย กลุ่ม 1)
  { title: 'วิศวกรรมสาร มข.', normalizedTitle: 'วิศวกรรมสาร มข', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารวิจัย มข.', normalizedTitle: 'วารสารวิจัย มข', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารวิชาการ มหาวิทยาลัยอุบลราชธานี', normalizedTitle: 'วารสารวิชาการ มหาวิทยาลัยอุบลราชธานี', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารวิชาการพระจอมเกล้าพระนครเหนือ', normalizedTitle: 'วารสารวิชาการพระจอมเกล้าพระนครเหนือ', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารวิจัยและพัฒนา มจธ.', normalizedTitle: 'วารสารวิจัยและพัฒนา มจธ', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยเกษตรศาสตร์', normalizedTitle: 'วารสารวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยเกษตรศาสตร์', tier: 'TCI 1', database: 'TCI' },
  { title: 'วารสารสมาคมวิศวกรรมเกษตรแห่งประเทศไทย', normalizedTitle: 'วารสารสมาคมวิศวกรรมเกษตรแห่งประเทศไทย', tier: 'TCI 1', database: 'TCI' },

  // TCI Tier 2
  { title: 'วารสารไทยการเกษตร', normalizedTitle: 'วารสารไทยการเกษตร', tier: 'TCI 2', database: 'TCI' },
  { title: 'วารสารวิศวกรรมศาสตร์ มหาวิทยาลัยศรีปทุม', normalizedTitle: 'วารสารวิศวกรรมศาสตร์ มหาวิทยาลัยศรีปทุม', tier: 'TCI 2', database: 'TCI' },
  { title: 'วารสารวิศวกรรมฟาร์ม', normalizedTitle: 'วารสารวิศวกรรมฟาร์ม', tier: 'TCI 2', database: 'TCI' },
];

export const JOURNAL_TIER_STYLES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'Q1': { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', glow: 'rgba(16, 185, 129, 0.25)' },
  'Q2': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', glow: 'rgba(37, 99, 235, 0.25)' },
  'Q3': { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', glow: 'rgba(202, 138, 4, 0.25)' },
  'Q4': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', glow: 'rgba(234, 88, 12, 0.25)' },
  'TCI 1': { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', glow: 'rgba(124, 58, 237, 0.25)' },
  'TCI 2': { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff', glow: 'rgba(147, 51, 234, 0.25)' },
  'International Conference': { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4', glow: 'rgba(13, 148, 136, 0.25)' },
  'National Conference': { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', glow: 'rgba(71, 85, 105, 0.25)' },
};

export function autoDetectJournalRanking(journalName?: string, levelHint?: string): string {
  const clean = String(journalName || '')
    .toLowerCase()
    .replace(/[,\.:;\(\)\[\]"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const lvl = String(levelHint || '').toLowerCase();

  for (const entry of KNOWN_JOURNALS_INDEX) {
    if (
      clean &&
      (clean === entry.normalizedTitle ||
        clean.includes(entry.normalizedTitle) ||
        entry.normalizedTitle.includes(clean))
    ) {
      return entry.tier;
    }
  }

  const combined = `${clean} ${lvl}`;
  if (combined.includes('q1') || combined.includes('quartile 1')) return 'Q1';
  if (combined.includes('q2') || combined.includes('quartile 2')) return 'Q2';
  if (combined.includes('q3') || combined.includes('quartile 3')) return 'Q3';
  if (combined.includes('q4') || combined.includes('quartile 4')) return 'Q4';
  if (
    combined.includes('tci 2') ||
    combined.includes('tci2') ||
    combined.includes('tci กลุ่ม 2') ||
    combined.includes('tci กลุ่มที่ 2')
  ) {
    return 'TCI 2';
  }
  if (
    combined.includes('tci 1') ||
    combined.includes('tci1') ||
    combined.includes('tci กลุ่ม 1') ||
    combined.includes('tci กลุ่มที่ 1') ||
    combined.includes('tci')
  ) {
    return 'TCI 1';
  }
  if (combined.includes('scopus') || combined.includes('นานาชาติ') || combined.includes('international')) {
    return 'Q2';
  }
  return 'TCI 1';
}
