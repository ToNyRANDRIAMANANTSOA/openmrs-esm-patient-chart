import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateLong, formatDurationDays, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const SportsFitnessTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedEncounterDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const onmNumber = getObsByConceptKeywords(obs, 'onm', 'inscription', 'ordre');
  const sports = getObsByConceptKeywords(obs, 'sport', 'pratique', 'activit', 'discipline');
  const placeOfBirth = getObsByConceptKeywords(obs, 'lieu naissance', 'birth place');
  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');

  const fitValue = getObsByConceptKeywords(
    obs,
    'aptitude',
    'decision',
    'fit',
    'permet',
    'certifie',
    'statut',
  ).toLowerCase();
  let isFit: boolean | null = null;
  if (
    fitValue.includes('ne permet pas') ||
    fitValue.includes('inapte') ||
    fitValue.includes('no') ||
    fitValue.includes('non') ||
    fitValue === 'false'
  ) {
    isFit = false;
  } else if (
    fitValue.includes('permet') ||
    fitValue.includes('apte') ||
    fitValue.includes('yes') ||
    fitValue.includes('oui') ||
    fitValue === 'true'
  ) {
    isFit = true;
  }

  const durationRaw = getObsByConceptKeywords(obs, 'durée', 'duree', 'duration', 'validity', 'période');
  const isIndeterminate =
    durationRaw.toLowerCase().includes('indéterminé') || durationRaw.toLowerCase().includes('indefinite');
  const duration = isIndeterminate ? '' : formatDurationDays(durationRaw, t('dayUnit'));

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('sportsCertTitle')}</h1>

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
            {placeOfBirth && (
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>{t('placeOfBirth')}</span>
                <span className={styles.fieldValue}>{placeOfBirth}</span>
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

        {/* ── Medical decision ── */}
        <div className={styles.certSection}>
          <span className={styles.certSectionLabel}>{t('medicalDecision')}</span>
          <p style={{ marginBottom: 10, fontStyle: 'italic', color: '#444', fontSize: '10pt' }}>
            {t('sportsMedDeclaration')}
          </p>

          {isFit === true && (
            <div className={styles.fieldGrid}>
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('allowsSports')}</span>
                <span className={styles.fieldValue}>{sports}</span>
              </div>
            </div>
          )}

          {isFit === false && (
            <div className={styles.fieldGrid}>
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('prohibitsSports')}</span>
                <span className={styles.fieldValue}>{sports}</span>
              </div>
              {duration && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('overDuration')}</span>
                  <span className={styles.fieldValue}>{duration}</span>
                </div>
              )}
              {isIndeterminate && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('overDuration')}</span>
                  <span className={styles.fieldValue}>{t('indeterminate')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.closingStatement}>{t('sportsCertClosing')}</div>

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

export default SportsFitnessTemplate;
