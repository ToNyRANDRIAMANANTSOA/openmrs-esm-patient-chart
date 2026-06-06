import { type Prescription } from '../../types/prescription';

export type PrescriptionBodyProps = {
  prescription: Prescription;
  isLoadingEncounters?: boolean;
  formatDate: (dateString: string) => string;
};
