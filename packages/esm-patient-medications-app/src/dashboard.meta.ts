import { type DashboardLinkConfig } from '@tebokaroa/openmrs-esm-patient-common-lib';

export const moduleName = '@tebokaroa/openmrs-esm-patient-medications-app';
export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  slot: 'patient-chart-medications-dashboard-slot',
  path: 'Medications',
  title: 'Medications',
  icon: 'omrs-icon-medication',
};
