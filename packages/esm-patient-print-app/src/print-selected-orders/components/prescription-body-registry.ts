import DrugPrescriptionBody from './bodies/DrugPrescriptionBody';
import TestPrescriptionBody from './bodies/TestPrescriptionBody';
import ReferralPrescriptionBody from './bodies/ReferralPrescriptionBody';
import ProcedurePrescriptionBody from './bodies/ProcedurePrescriptionBody';
import RadiologyPrescriptionBody from './bodies/RadiologyPrescriptionBody';

export const prescriptionBodyComponentMap = {
  'Drug Order': DrugPrescriptionBody,
  'Test Order': TestPrescriptionBody,
  'Radiology Order': RadiologyPrescriptionBody,
  'Imaging Order': RadiologyPrescriptionBody,
  'Procedure Order': ProcedurePrescriptionBody,
  'Referral Order': ReferralPrescriptionBody,

  default: DrugPrescriptionBody,
};
