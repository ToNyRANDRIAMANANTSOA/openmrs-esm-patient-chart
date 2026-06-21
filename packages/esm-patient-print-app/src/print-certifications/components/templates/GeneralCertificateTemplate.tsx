import React from 'react';
import { useTranslation } from 'react-i18next';
import { calcDurationDays, formatDateLong, formatDurationDays, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const GeneralCertificateTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedEncounterDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const onmNumber = getObsByConceptKeywords(obs, 'onm', 'inscription', 'ordre');
  const placeOfBirth = getObsByConceptKeywords(obs, 'lieu naissance', 'birth place', 'lieu de naissance');
  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');
  const leaveStartRaw = getObsByConceptKeywords(obs, 'début', 'start', 'date début', 'from date');
  const leaveEndRaw = getObsByConceptKeywords(obs, 'fin', 'end', 'date fin', 'to date');
  const leaveStart = formatDateLong(leaveStartRaw, locale);
  const leaveEnd = formatDateLong(leaveEndRaw, locale);

  const calculatedDays = calcDurationDays(leaveStartRaw, leaveEndRaw);
  const leaveDaysRaw = getObsByConceptKeywords(obs, 'durée', 'jours', 'jour', 'arrêt', 'repos', 'duration', 'days');
  const leaveDays =
    calculatedDays !== null ? `${calculatedDays} ${t('dayUnit')}` : formatDurationDays(leaveDaysRaw, t('dayUnit'));

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('generalCertTitle')}</h1>

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
          <span className={styles.certSectionLabel}>{t('certifiesExaminedToday')}</span>
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
            {(placeOfBirth || patientDetails?.location) && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('placeOfBirth')}</span>
                <span className={styles.fieldValue}>{placeOfBirth || patientDetails?.location}</span>
              </div>
            )}
            {patientDetails?.address && (
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('address')}</span>
                <span className={styles.fieldValue}>{patientDetails.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.certStatement}>
          {t(
            'generalCertStatement',
            'And certifies, after clinical examination, that the health of the above-named person warrants the issuance of this medical certificate.',
          )}
        </div>

        {/* ── Medical leave — only if data exists ── */}
        {leaveDays && (
          <div className={styles.certSection}>
            <span className={styles.certSectionLabel}>{t('notesHealthRequires')}</span>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('medicalLeavePrefix')}</span>
                <span className={styles.fieldValue}>{leaveDays}</span>
              </div>
              {leaveStart && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('leavingFrom')}</span>
                  <span className={styles.fieldValue}>{leaveStart}</span>
                </div>
              )}
              {leaveEnd && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('leavingTo')}</span>
                  <span className={styles.fieldValue}>{leaveEnd}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.closingStatement}>{t('generalCertClosing')}</div>

        <div className={styles.dateAndPlaceRow}>
          <span>{t('doneAt')}</span>
          <span className={styles.dateValue}>{lieu || patientDetails?.location || '...'}</span>
          <span>{t('andThe')}</span>
          <span className={styles.dateValue}>{formattedEncounterDate}</span>
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

export default GeneralCertificateTemplate;
