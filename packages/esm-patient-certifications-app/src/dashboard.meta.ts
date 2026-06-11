import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';

export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  slot: 'patient-chart-certifications-dashboard-slot',
  path: 'certifications',
  title: 'Certifications',
  icon: 'omrs-icon-document',
};
