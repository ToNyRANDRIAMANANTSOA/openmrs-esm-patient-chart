import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateLong, formatDurationDays, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const SchoolCertificateTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');
  const excuseDaysRaw = getObsByConceptKeywords(obs, 'durée', 'jours', 'excuse', 'repos', 'convalescence', 'duration');
  const excuseDays = formatDurationDays(excuseDaysRaw, t('dayUnit'));
  const startDate = formatDateLong(getObsByConceptKeywords(obs, 'début', 'start date', 'à compter du'), locale);
  const reason = getObsByConceptKeywords(obs, 'motif', 'reason', 'diagnostic');

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('schoolCertTitle')}</h1>

      <div className={styles.certBody}>
        {/* ── Doctor ── */}
        <div className={styles.certSection}>
          <span className={styles.certSectionLabel}>{t('certifyingDoctor')}</span>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>{t('doctorName')}</span>
              <span className={styles.fieldValue}>{doctorName ? `Dr ${doctorName}` : ''}</span>
            </div>
            <div className={styles.fieldItem}>
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
          </div>
        </div>

        <div className={styles.certStatement}>
          {t('schoolAbsenceStatement')}
          {excuseDays ? (
            <strong>
              {' '}
              {t('durationOf')} {excuseDays}
            </strong>
          ) : (
            ''
          )}
          {startDate ? (
            <>
              {' '}
              {t('startingFrom')} <strong>{startDate}</strong>
            </>
          ) : (
            ''
          )}
          {reason ? (
            <>
              {' '}
              {t('forFollowingReason')} : <strong>{reason}</strong>
            </>
          ) : (
            ''
          )}
          .
        </div>

        <div className={styles.closingStatement}>{t('schoolCertClosing')}</div>

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

export default SchoolCertificateTemplate;
