// Dynamically set modulename (for customized packages / distro)
import { name as pkgName } from '../package.json' assert { type: 'json' };

export const moduleName = pkgName;
// export const moduleName = '@openmrs/esm-patient-print-app';
