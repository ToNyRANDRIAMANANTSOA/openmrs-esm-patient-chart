import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateLong, formatDurationDays, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const FitToFlyTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');
  const onmNumber = getObsByConceptKeywords(obs, 'onm', 'inscription', 'ordre');
  const destination = getObsByConceptKeywords(obs, 'destination', 'flight', 'vol', 'voyage');
  const validityRaw = getObsByConceptKeywords(obs, 'validité', 'validity', 'durée', 'période');
  const validityPeriod = formatDurationDays(validityRaw, t('dayUnit'));
  const remarks = getObsByConceptKeywords(obs, 'remarque', 'remark', 'observation', 'note', 'comment');

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('fitToFlyCertTitle')}</h1>

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
            {patientDetails?.identifiers?.length > 0 && (
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('id')}</span>
                <span className={styles.fieldValue}>{patientDetails.identifiers.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.certStatement}>{t('fitnessForFlight')}</div>

        {(destination || validityPeriod || remarks) && (
          <div className={styles.certSection}>
            <span className={styles.certSectionLabel}>{t('flightDetails')}</span>
            <div className={styles.fieldGrid}>
              {destination && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('destination')}</span>
                  <span className={styles.fieldValue}>{destination}</span>
                </div>
              )}
              {validityPeriod && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('certValidity')}</span>
                  <span className={styles.fieldValue}>{validityPeriod}</span>
                </div>
              )}
              {remarks && (
                <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                  <span className={styles.fieldLabel}>{t('remarks')}</span>
                  <span className={styles.fieldValue}>{remarks}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.closingStatement}>{t('fitToFlyCertClosing')}</div>

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

export default FitToFlyTemplate;
