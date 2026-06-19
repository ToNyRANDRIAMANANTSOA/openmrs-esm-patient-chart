import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';
import certificationsOverviewComponent from './programs/programs-overview.component';
import certificationsDetailedSummaryComponent from './programs/programs-detailed-summary.component';

import medicalCertifications from './encounters-table/certifications-detailed-summary.component';

const moduleName = '@openmrs/esm-patient-certifications-app';

const options = {
  featureName: 'patient-certifications',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const certificationsOverview = getSyncLifecycle(certificationsOverviewComponent, options);

// export const certificationsDetailedSummary = getSyncLifecycle(certificationsDetailedSummaryComponent, options);
export const certificationsDetailedSummary = getSyncLifecycle(medicalCertifications, options);

// extention
export const printCertificationsExtensionButton = getAsyncLifecycle(
  () => import('./encounters-table/encounters-table.component'),
  options,
);

export const certificationsDashboardLink =
  // t('Programs', 'Programs')
  getSyncLifecycle(
    createDashboardLink({
      ...dashboardMeta,
    }),
    options,
  );

// t('certificationEnrollmentWorkspaceTitle', 'Record certification enrollment')
export const certificationsFormWorkspace = getAsyncLifecycle(
  () => import('./programs/programs-form.workspace'),
  options,
);

export const deleteProgramConfirmationModal = getAsyncLifecycle(
  () => import('./programs/delete-program.modal'),
  options,
);
