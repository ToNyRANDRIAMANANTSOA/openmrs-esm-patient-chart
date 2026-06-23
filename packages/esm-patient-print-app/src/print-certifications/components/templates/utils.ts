// TODO: replace these datetime utils with openmrs' built-in date formater which already supports locales etc.

/**
 * Shared utilities used across all certificate templates.
 */

const MONTHS_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Converts any recognisable date string to long letter format: "30 Juin 2002" / "30 June 2002" */
export function formatDateLong(dateStr: string, locale = 'fr-FR'): string {
  if (!dateStr) return '';

  let date: Date | undefined;

  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    // ISO datetime "2002-06-30T10:00:00.000+0000" — keep local timezone
    date = new Date(dateStr);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // ISO date "2002-06-30" — parse as local date to avoid off-by-one shifts
    const [y, m, d] = dateStr.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // DD/MM/YYYY
    const [d, m, y] = dateStr.split('/').map(Number);
    date = new Date(y, m - 1, d);
  }

  if (!date || isNaN(date.getTime())) return dateStr;

  const isFr = locale.startsWith('fr');
  const months = isFr ? MONTHS_FR : MONTHS_EN;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) return new Date(dateStr);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
}

/** Returns the number of days between two date strings, inclusive (start + end both counted). */
export function calcDurationDays(startStr: string, endStr: string): number | null {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (!start || !end) return null;
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : null;
}

/** If value is a plain integer, appends the translated day unit ("30 jour(s)" / "30 day(s)"). */
export function formatDurationDays(value: string, dayUnit: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    return `${trimmed} ${dayUnit}`;
  }
  return value;
}

/** @deprecated Use formatDateLong(dob, locale) directly. */
export function formatBirthDate(dob: string, locale = 'fr-FR'): string {
  return formatDateLong(dob, locale);
}

export function getObsValue(obs: any): string {
  if (obs.value?.display) return obs.value.display;
  if (typeof obs.value === 'string') return obs.value;
  if (typeof obs.value === 'object' && obs.value !== null) {
    return obs.value.display || JSON.stringify(obs.value);
  }
  const display = obs.display || '';
  const colonIndex = display.indexOf(':');
  if (colonIndex !== -1) {
    return display.substring(colonIndex + 1).trim();
  }
  return display;
}

export function getObsByConceptKeywords(obsList: Array<any>, ...keywords: string[]): string {
  let result = '';
  if (!obsList) return result;

  const traverse = (obs: any) => {
    const conceptName = (obs.concept?.display || '').toLowerCase();
    const matches = keywords.some((kw) => conceptName.includes(kw.toLowerCase()));
    if (matches) {
      result = getObsValue(obs);
      return;
    }
    if (obs.groupMembers && Array.isArray(obs.groupMembers)) {
      obs.groupMembers.forEach(traverse);
    }
  };

  obsList.forEach(traverse);
  return result;
}

/** Recursively flattens obs groups into leaf obs entries. */
export function flattenObs(obsList: any[]): any[] {
  return (obsList ?? []).flatMap((obs) => (obs.groupMembers?.length ? flattenObs(obs.groupMembers) : [obs]));
}
