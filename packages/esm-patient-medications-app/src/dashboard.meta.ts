import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';
// Dynamically set modulename (for customized packages / distro)
import { name as pkgName } from '../package.json' assert { type: 'json' };
export const moduleName = pkgName;
// export const moduleName = '@openmrs/esm-patient-medications-app';

export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  slot: 'patient-chart-medications-dashboard-slot',
  path: 'medications',
  title: 'Medications',
  icon: 'omrs-icon-medication',
};
