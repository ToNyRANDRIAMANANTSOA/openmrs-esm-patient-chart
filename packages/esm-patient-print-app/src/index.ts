import { getAsyncLifecycle, getSyncLifecycle, defineConfigSchema } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';

const options = {
  featureName: 'patient-print',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// Root component

// Extensions
export const printSelectedOrdersButtonExtension = getAsyncLifecycle(
  () => import('./print-selected-orders/print-selected-orders-button.extension'),
  options,
);

// Modals
export const printSelectedOrdersModal = getAsyncLifecycle(
  () => import('./print-selected-orders/components/print-selected-orders.modal'),
  options,
);

// Workspaces
