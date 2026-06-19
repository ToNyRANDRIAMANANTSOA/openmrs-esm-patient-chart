import { type FormatDateOptions } from '@openmrs/esm-framework';
import { type Prescription } from '../../types/prescription';

export type PrescriptionBodyProps = {
  prescription: Prescription;
  isLoadingEncounters?: boolean;
  formatDate: (dateString: string, options?: Partial<FormatDateOptions>) => string;
};
