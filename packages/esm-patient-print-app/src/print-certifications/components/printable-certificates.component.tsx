import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../../print-selected-orders/components/printable-prescription.scss';
import { type Certificate } from '../types/certifications';

import { getCertificateBodyConfig } from './certificate-body-registry';
import PrintHeader from '../../shared/components/print-header.component';
import PrintPatientDetails from '../../shared/components/print-patient-details.component';
import PrintProviderIntro from '../../shared/components/print-provider-intro.component';
import PrintSignatureBlock from './print-signature-block.component';
import CenterDetailsFooter from '../../shared/components/center-details-footer.component';
import { type ConfigSchema } from '../../config-schema';
import { useConfig } from '@openmrs/esm-framework';
import { formatDateLong } from './templates/utils';

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
  const { t, i18n } = useTranslation();

  const certTitles: Record<string, string> = {
    generalCertTitle: t('generalCertTitle', 'Medical Certificate'),
    birthCertTitle: t('birthCertTitle', 'Birth Certificate'),
    deathCertTitle: t('deathCertTitle', 'Death Certificate'),
    divingCertTitle: t('divingCertTitle', 'Diving Fitness Certificate'),
    fitToFlyCertTitle: t('fitToFlyCertTitle', 'Certificate of Fitness to Fly'),
    goodHealthCertTitle: t('goodHealthCertTitle', 'Good Health Certificate'),
    nonContagionCertTitle: t('nonContagionCertTitle', 'Non-Contagion Certificate'),
    schoolCertTitle: t('schoolCertTitle', 'School Medical Certificate'),
    sportsCertTitle: t('sportsCertTitle', 'Medical Certificate of Fitness for Sports'),
  };
  const certSubtitles: Record<string, string> = {
    fitToFlyCertSubtitle: t('fitToFlyCertSubtitle', '(Medical certificate of non-contraindication to air transport)'),
  };

  const BodyComponent = certConfig.bodyComponent;

  const location = certificate.encounter?.visit?.location;
  const locationName = location?.display ?? location?.name ?? '';
  const encounterDate = certificate.encounter?.encounterDatetime
    ? formatDateLong(certificate.encounter.encounterDatetime, i18n.language)
    : '';

  return (
    <div className={styles.printWrapper}>
      <PrintHeader
        title={(certTitles[certConfig.titleKey] ?? certConfig.title).toUpperCase()}
        subtitle={certConfig.subtitleKey ? certSubtitles[certConfig.subtitleKey] : undefined}
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
        showHeaderBorderBottom={false}
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
        useLargerFontSize={true}
        showBorders={true}
      />

      <BodyComponent certificate={certificate} isLoadingEncounters={isLoadingEncounters} />

      <p style={{ marginTop: '2rem', fontWeight: 'bold', lineHeight: 1.8 }}>
        {t(
          'certClosingStatement',
          "Ce certificat est établi la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit.",
        )}
      </p>

      <PrintSignatureBlock location={location} encounterDate={encounterDate} />

      <CenterDetailsFooter location={location} />
    </div>
  );
};

export default PrintableCertificate;
