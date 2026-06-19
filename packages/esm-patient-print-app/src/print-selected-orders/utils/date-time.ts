import { formatDate, type FormatDateOptions } from '@openmrs/esm-framework';

export const formatDateUtils = (dateString: string, options?: Partial<FormatDateOptions>) =>
  dateString && formatDate(new Date(dateString), { noToday: true, ...options });
