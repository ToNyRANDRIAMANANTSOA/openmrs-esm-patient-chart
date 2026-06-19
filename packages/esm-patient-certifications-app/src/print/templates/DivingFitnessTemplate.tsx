import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateLong, formatDurationDays, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const DivingFitnessTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');
  const onmNumber = getObsByConceptKeywords(obs, 'onm', 'inscription', 'ordre');
  const maxDepth = getObsByConceptKeywords(obs, 'profondeur', 'depth', 'plongée');
  const validityRaw = getObsByConceptKeywords(obs, 'validité', 'validity', 'durée', 'période');
  const validityPeriod = formatDurationDays(validityRaw, t('dayUnit'));

  const fitValue = getObsByConceptKeywords(obs, 'aptitude', 'fit', 'apte', 'decision').toLowerCase();
  const isFit =
    fitValue.includes('apte') || fitValue.includes('yes') || fitValue.includes('oui') || fitValue === 'true'
      ? true
      : fitValue.includes('inapte') || fitValue.includes('no') || fitValue.includes('non') || fitValue === 'false'
        ? false
        : null;

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('divingCertTitle')}</h1>

      <div className={styles.certBody}>
        {/* ── Doctor ── */}
        <div className={styles.certSection}>
          <span className={styles.certSectionLabel}>{t('certifyingDoctor')}</span>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>{t('doctorName')}</span>
              <span className={styles.fieldValue}>{doctorName ? `Dr ${doctorName}` : ''}</span>
            </div>
            {onmNumber && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('orderNumber')}</span>
                <span className={styles.fieldValue}>{onmNumber}</span>
              </div>
            )}
            <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
              <span className={styles.fieldLabel}>{t('quality')}</span>
              <span className={styles.fieldValue}>{t('stateMD')}</span>
            </div>
          </div>
        </div>

        {/* ── Patient ── */}
        <div className={styles.certSection}>
          <span className={styles.certSectionLabel}>{t('patientExamined')}</span>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>{t('familyName')}</span>
              <span className={styles.fieldValue}>{patientDetails?.familyName}</span>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>{t('givenNames')}</span>
              <span className={styles.fieldValue}>{patientDetails?.givenName}</span>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>{t('birthDate')}</span>
              <span className={styles.fieldValue}>{formattedDob}</span>
            </div>
            {patientDetails?.age && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('ageLabel')}</span>
                <span className={styles.fieldValue}>{patientDetails.age}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Medical decision — show only the applicable option ── */}
        <div className={styles.certSection}>
          <span className={styles.certSectionLabel}>{t('medicalDecision')}</span>
          <p style={{ marginBottom: 10, fontStyle: 'italic', color: '#444', fontSize: '10pt' }}>
            {t('healthStateDeclaration')}
          </p>

          <div className={styles.fieldGrid}>
            {isFit === true && (
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('medicalDecision')}</span>
                <span className={styles.fieldValue}>{t('allowsDiving')}</span>
              </div>
            )}
            {isFit === false && (
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('medicalDecision')}</span>
                <span className={styles.fieldValue}>{t('prohibitsDiving')}</span>
              </div>
            )}
            {maxDepth && isFit === true && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('maxDepth')}</span>
                <span className={styles.fieldValue}>{maxDepth}</span>
              </div>
            )}
            {validityPeriod && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('certValidity')}</span>
                <span className={styles.fieldValue}>{validityPeriod}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.closingStatement}>{t('divingCertClosing')}</div>

        <div className={styles.dateAndPlaceRow}>
          <span>{t('doneAt')}</span>
          <span className={styles.dateValue}>{lieu || patientDetails?.location || '...'}</span>
          <span>{t('andThe')}</span>
          <span className={styles.dateValue}>{formattedDate}</span>
        </div>
      </div>

      <div className={styles.signatureSection}>
        <div className={styles.signatureLine}>
          <div className={styles.signatureLineBar} />
          <span className={styles.signatureLabel}>{t('signatureStamp')}</span>
        </div>
        <div className={styles.signatureLine}>
          <div className={styles.signatureLineBar} />
          <span className={styles.signatureLabel}>{t('patientResponsibleSignature')}</span>
        </div>
      </div>
    </div>
  );
};

export default DivingFitnessTemplate;
