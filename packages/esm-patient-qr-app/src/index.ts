import { defineConfigSchema, getAsyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';

const moduleName = '@openmrs/esm-patient-qr-app';

const options = {
  featureName: 'patient-qr',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const patientQrButton = getAsyncLifecycle(() => import('./qr-button/qr-button.component'), options);

export const patientQrModal = getAsyncLifecycle(() => import('./qr-modal/qr-modal.component'), options);
