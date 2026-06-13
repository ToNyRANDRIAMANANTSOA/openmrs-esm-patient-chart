import { formatDate, useConfig } from '@openmrs/esm-framework';

export const formatDateUtils = (dateString: string) => formatDate(new Date(dateString), { noToday: true });
