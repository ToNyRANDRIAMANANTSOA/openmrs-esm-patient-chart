import React from 'react';

import styles from './printable-prescription.scss';
import { type Prescription } from '../types/prescription';
import { useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { type ConfigSchema } from '../../config-schema';

import { getPrescriptionTypeMetadata } from './prescription-type-map';
import { prescriptionBodyComponentMap } from './prescription-body-registry';
import { formatDateUtils } from '../utils/date-time';
import PrintHeader from '../../shared/components/print-header.component';
import PrintPatientDetails from '../../shared/components/print-patient-details.component';
import CenterDetailsFooter from '../../shared/components/center-details-footer.component';

type PrintablePrescriptionProps = {
  prescription: Prescription;
  isLoadingProviders?: boolean;
  isLoadingEncounters?: boolean;
  index?: number;
};

const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({
  prescription,
  isLoadingProviders,
  isLoadingEncounters,
}) => {
  const { t } = useTranslation();

  const { translationKey, defaultLabel } = getPrescriptionTypeMetadata(prescription?.metadata?.prescriptionType);

  const { prescriptionsPrint } = useConfig<ConfigSchema>();

  const BodyComponent =
    prescriptionBodyComponentMap[prescription?.metadata?.prescriptionType] ?? prescriptionBodyComponentMap.default;

  // TODO: If weight must be display, get inspiration from :
  // VitalsHeader at openmrs-esm-patient-chart\packages\esm-patient-vitals-app\src\vitals-and-biometrics-header\vitals-header.extension.tsx:45
  // const { data: vitals, isLoading, isValidating } = useVitalsAndBiometrics(patientUuid, 'both');

  const location = prescription?.encounter?.visit?.location;

  return (
    <div className={styles.printWrapper}>
      <PrintHeader
        title={t(translationKey, defaultLabel).toUpperCase()}
        provider={prescription?.provider}
        location={location}
        isLoadingProviders={isLoadingProviders}
        isLoadingEncounters={isLoadingEncounters}
      />

      <PrintPatientDetails
        patient={prescription?.patient}
        encounter={prescription?.encounter}
        config={{
          showIdentifierRow: prescriptionsPrint.showPatientIdentifierRow,
          leftQrCode: prescriptionsPrint.leftQrCode,
          rightQrCode: prescriptionsPrint.rightQrCode,
        }}
        isLoadingEncounters={isLoadingEncounters}
      />

      <BodyComponent
        prescription={prescription}
        isLoadingEncounters={isLoadingEncounters}
        formatDate={formatDateUtils}
      />

      <CenterDetailsFooter location={location} />
    </div>
  );
};

export default PrintablePrescription;
