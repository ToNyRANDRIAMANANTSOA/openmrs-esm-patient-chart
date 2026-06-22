import React from 'react';

import styles from '../../print-selected-orders/components/printable-prescription.scss';
import { type Certificate } from '../types/certifications';

import { getCertificateBodyConfig } from './certificate-body-registry';
import PrintHeader from '../../shared/components/print-header.component';
import PrintPatientDetails from '../../shared/components/print-patient-details.component';
import CenterDetailsFooter from '../../shared/components/center-details-footer.component';

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
      />

      <PrintPatientDetails
        patient={certificate.patient}
        encounter={certificate.encounter as any}
        isLoadingEncounters={isLoadingEncounters}
      />

      <BodyComponent certificate={certificate} isLoadingEncounters={isLoadingEncounters} />

      <CenterDetailsFooter location={location} />
    </div>
  );
};

export default PrintableCertificate;
