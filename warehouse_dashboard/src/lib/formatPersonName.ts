/**
 * Shared helper utility for Thai person name formatting and parsing.
 * Single source of truth across all components, tables, drawers, and exports.
 */

export const KNOWN_PERSONNEL_TITLES: string[] = [
  'ศาสตราจารย์ดร.', 'รองศาสตราจารย์ดร.', 'ผู้ช่วยศาสตราจารย์ดร.',
  'ศาสตราจารย์ ดร.', 'รองศาสตราจารย์ ดร.', 'ผู้ช่วยศาสตราจารย์ ดร.',
  'ศาสตราจารย์', 'รองศาสตราจารย์', 'ผู้ช่วยศาสตราจารย์',
  'ศ.ดร.', 'รศ.ดร.', 'ผศ.ดร.', 'อ.ดร.',
  'ศ. ดร.', 'รศ. ดร.', 'ผศ. ดร.', 'อ. ดร.',
  'อาจารย์ ดร.', 'อาจารย์', 'อ.', 'ดร.',
  'นางสาว', 'น.ส.', 'นาง', 'นาย',
  'ว่าที่ร.ต. ดร.', 'ว่าที่ ร.ต. ดร.', 'ว่าที่ร.ต.', 'ว่าที่ ร.ต.',
  'Prof. Dr.', 'Prof.', 'Assoc. Prof.', 'Asst. Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'
].sort((a, b) => b.length - a.length);

export interface PersonNameFields {
  prefix?: string | null;
  title?: string | null;
  title_th?: string | null;
  titleTh?: string | null;
  first_name?: string | null;
  firstName?: string | null;
  last_name?: string | null;
  lastName?: string | null;
  name?: string | null;
  name_th?: string | null;
  nameTh?: string | null;
  clean_name?: string | null;
}

export interface FormatPersonNameOptions {
  includePrefix?: boolean;
}

/**
 * Goal #2: Formats a person's name as:
 * - When includePrefix is true: prefix + first name + ONE space + last name
 *   No space between prefix and first name; exactly one space between first and last name.
 *   Example: prefix "รศ.ดร.", first "สมชาย", last "ใจดี" -> "รศ.ดร.สมชาย ใจดี"
 *   If prefix empty: "สมชาย ใจดี"
 *   If last name empty: "สมชาย" (no trailing space)
 * - When includePrefix is false: first name + ONE space + last name (no prefix)
 *   Example: "สมชาย ใจดี"
 */
export function formatPersonName(
  person?: PersonNameFields | string | null,
  options: FormatPersonNameOptions = { includePrefix: true }
): string {
  if (!person) return '';

  const includePrefix = options.includePrefix !== false;

  // If a raw string is passed
  if (typeof person === 'string') {
    const raw = person.trim().replace(/\s+/g, ' ');
    if (!raw || raw === '-' || raw === 'nan') return '';
    if (includePrefix) return raw;

    // Strip prefix for includePrefix: false
    let clean = raw;
    for (const title of KNOWN_PERSONNEL_TITLES) {
      if (clean.startsWith(title)) {
        clean = clean.substring(title.length).trim();
        break;
      }
    }
    return clean.replace(/\s+/g, ' ').trim();
  }

  // Resolve prefix / title
  const prefix = String(
    person.prefix ?? person.title_th ?? person.titleTh ?? person.title ?? ''
  ).trim();

  // Resolve first_name and last_name
  const firstName = String(person.first_name ?? person.firstName ?? '').trim();
  const lastName = String(person.last_name ?? person.lastName ?? '').trim();

  // If we have separated first_name or last_name
  if (firstName || lastName) {
    const namePart = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (!namePart) return '';
    if (!includePrefix || !prefix) {
      return namePart;
    }
    // Prefix glued to firstName: prefix + first + (space + last)
    return `${prefix}${firstName}${lastName ? ' ' + lastName : ''}`;
  }

  // Fallback to legacy single full name string if first/last not yet populated
  const legacyFull = String(
    person.name ?? person.name_th ?? person.nameTh ?? ''
  ).trim().replace(/\s+/g, ' ');

  if (!legacyFull || legacyFull === '-' || legacyFull === 'nan') return '';

  if (includePrefix) {
    // If prefix is specified and legacy name does not start with it, prepend it
    if (prefix && !legacyFull.startsWith(prefix)) {
      return `${prefix}${legacyFull}`;
    }
    return legacyFull;
  }

  // When includePrefix is false, strip known prefix from legacy full name
  let cleanLegacy = legacyFull;
  if (prefix && cleanLegacy.startsWith(prefix)) {
    cleanLegacy = cleanLegacy.substring(prefix.length).trim();
  } else {
    for (const title of KNOWN_PERSONNEL_TITLES) {
      if (cleanLegacy.startsWith(title)) {
        cleanLegacy = cleanLegacy.substring(title.length).trim();
        break;
      }
    }
  }
  return cleanLegacy.replace(/\s+/g, ' ').trim();
}

export interface SplitFullNameResult {
  prefix: string;
  title_th: string;
  firstName: string;
  first_name: string;
  lastName: string;
  last_name: string;
  needsReview: boolean;
  reason?: string;
}

/**
 * Splits a full name string into prefix, firstName, and lastName.
 * Reusable logic for Excel imports and form pastes.
 */
export function splitFullName(
  fullName?: string | null,
  knownPrefixes: string[] | string = KNOWN_PERSONNEL_TITLES
): SplitFullNameResult {
  const prefixList = Array.isArray(knownPrefixes)
    ? knownPrefixes
    : (knownPrefixes ? [knownPrefixes, ...KNOWN_PERSONNEL_TITLES] : KNOWN_PERSONNEL_TITLES);

  if (!fullName) {
    return {
      prefix: '',
      title_th: '',
      firstName: '',
      first_name: '',
      lastName: '',
      last_name: '',
      needsReview: true,
      reason: 'Empty name',
    };
  }

  let clean = String(fullName)
    .normalize('NFC')
    .replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF\u200b]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  let detectedPrefix = '';

  for (const title of prefixList) {
    if (clean.startsWith(title)) {
      clean = clean.substring(title.length).trim();
      detectedPrefix = title;
      break;
    }
  }

  // Secondary check for concatenated titles (e.g. ผศ. + ดร.)
  for (const title of prefixList) {
    if (clean.startsWith(title)) {
      clean = clean.substring(title.length).trim();
      if (!detectedPrefix) detectedPrefix = title;
      break;
    }
  }

  clean = clean.trim().replace(/\s+/g, ' ');
  const tokens = clean.split(' ').filter(Boolean);

  if (tokens.length === 0) {
    return {
      prefix: detectedPrefix,
      title_th: detectedPrefix,
      firstName: '',
      first_name: '',
      lastName: '',
      last_name: '',
      needsReview: true,
      reason: 'Empty name after prefix strip',
    };
  }

  if (tokens.length === 1) {
    return {
      prefix: detectedPrefix,
      title_th: detectedPrefix,
      firstName: tokens[0],
      first_name: tokens[0],
      lastName: '',
      last_name: '',
      needsReview: true,
      reason: 'Single token (missing last name)',
    };
  }

  if (tokens.length === 2) {
    return {
      prefix: detectedPrefix,
      title_th: detectedPrefix,
      firstName: tokens[0],
      first_name: tokens[0],
      lastName: tokens[1],
      last_name: tokens[1],
      needsReview: false,
    };
  }

  // 3+ tokens
  return {
    prefix: detectedPrefix,
    title_th: detectedPrefix,
    firstName: tokens[0],
    first_name: tokens[0],
    lastName: tokens.slice(1).join(' '),
    last_name: tokens.slice(1).join(' '),
    needsReview: true,
    reason: `3+ tokens (${tokens.length} tokens): ambiguous multi-word name`,
  };
}
