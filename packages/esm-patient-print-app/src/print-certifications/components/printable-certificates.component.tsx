import React from 'react';

import styles from '../../print-selected-orders/components/printable-prescription.scss';
import { type Certificate } from '../types/certifications';

import { getCertificateBodyConfig } from './certificate-body-registry';
import PrintHeader from '../../shared/components/print-header.component';
import PrintPatientDetails from '../../shared/components/print-patient-details.component';
import PrintProviderIntro from '../../shared/components/print-provider-intro.component';
import CenterDetailsFooter from '../../shared/components/center-details-footer.component';
import { type ConfigSchema } from '../../config-schema';
import { useConfig } from '@openmrs/esm-framework';

type PrintableCertificateProps = {
  certificate: Certificate;
  isLoadingProviders?: boolean;
  isLoadingEncounters?: boolean;
  index?: number;
};

const PrintableCertificate: React.FC<PrintableCertificateProps> = ({
  certificate,
  isLoadingProviders,
  isLoadingEncounters,
}) => {
  const certConfig = getCertificateBodyConfig(certificate.encounterType ?? certificate.formName, certificate.encounter);

  const { certificatesPrint } = useConfig<ConfigSchema>();

  const BodyComponent = certConfig.bodyComponent;

  const location = certificate.encounter?.visit?.location;

  return (
    <div className={styles.printWrapper}>
      <PrintHeader
        title={certConfig.title.toUpperCase()}
        titlePosition="bottom-center"
        provider={certificate.provider}
        location={location}
        isLoadingProviders={isLoadingProviders}
        isLoadingEncounters={isLoadingEncounters}
        titleAndLogoInSharedRow={certificatesPrint.header.titleAndLogoInSharedRow}
        showProviderInfo={certificatesPrint.header.showProviderInfo}
        showClinicInfo={certificatesPrint.header.showClinicInfo}
        showFacilityAddress={certificatesPrint.header.showFacilityAddress}
        sideAAlignment={certificatesPrint.header.sideAAlignment}
        sideBAlignment={certificatesPrint.header.sideBAlignment}
      />

      <PrintProviderIntro provider={certificate.provider} isLoadingProviders={isLoadingProviders} />

      <PrintPatientDetails
        patient={certificate.patient}
        encounter={certificate.encounter as any}
        fields={certConfig.patientFields}
        config={{
          leftQrCode: certificatesPrint.leftQrCode,
          rightQrCode: certificatesPrint.rightQrCode,
        }}
        isLoadingEncounters={isLoadingEncounters}
      />

      <BodyComponent certificate={certificate} isLoadingEncounters={isLoadingEncounters} />

      <CenterDetailsFooter location={location} />
    </div>
  );
};

export default PrintableCertificate;
