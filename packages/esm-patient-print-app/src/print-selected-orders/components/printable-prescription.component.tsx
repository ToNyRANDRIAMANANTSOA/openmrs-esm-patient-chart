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

type TitlePosition = 'top-left' | 'bottom-center';

type PrintablePrescriptionProps = {
  prescription: Prescription;
  titlePosition?: TitlePosition;
  isLoadingProviders?: boolean;
  isLoadingEncounters?: boolean;
  index?: number;
};

const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({
  prescription,
  titlePosition,
  isLoadingProviders,
  isLoadingEncounters,
}) => {
  const { t } = useTranslation();

  const { translationKey, defaultLabel } = getPrescriptionTypeMetadata(prescription?.metadata?.prescriptionType);

  const { prescriptionsPrint } = useConfig<ConfigSchema>();

  const BodyComponent =
    prescriptionBodyComponentMap[prescription?.metadata?.prescriptionType] ?? prescriptionBodyComponentMap.default;

  const location = prescription?.encounter?.visit?.location;

  return (
    <div className={styles.printWrapper}>
      <PrintHeader
        title={t(translationKey, defaultLabel).toUpperCase()}
        titlePosition={titlePosition}
        provider={prescription?.provider}
        location={location}
        isLoadingProviders={isLoadingProviders}
        isLoadingEncounters={isLoadingEncounters}
        titleAndLogoInSharedRow={prescriptionsPrint.header.titleAndLogoInSharedRow}
        showProviderInfo={prescriptionsPrint.header.showProviderInfo}
        showClinicInfo={prescriptionsPrint.header.showClinicInfo}
        showFacilityAddress={prescriptionsPrint.header.showFacilityAddress}
        sideAAlignment={prescriptionsPrint.header.sideAAlignment}
        sideBAlignment={prescriptionsPrint.header.sideBAlignment}
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
