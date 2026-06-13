export const prescriptionTypeMap = {
  'Drug Order': {
    translationKey: 'drugPrescription',
    defaultLabel: 'Medical Prescription',
  },

  'Test Order': {
    translationKey: 'laboratoryRequest',
    defaultLabel: 'Laboratory Request',
  },

  'Radiology Order': {
    translationKey: 'radiologyRequest',
    defaultLabel: 'Radiology Request',
  },

  'Imaging Order': {
    translationKey: 'imagingRequest',
    defaultLabel: 'Imaging Request',
  },

  'Procedure Order': {
    translationKey: 'procedureRequest',
    defaultLabel: 'Procedure Request',
  },

  'Referral Order': {
    translationKey: 'referralRequest',
    defaultLabel: 'Referral Request',
  },
} as const;

export function getPrescriptionTypeMetadata(orderTypeName?: string) {
  return (
    prescriptionTypeMap[orderTypeName] ?? {
      translationKey: 'prescription',
      defaultLabel: 'Prescription',
    }
  );
}
