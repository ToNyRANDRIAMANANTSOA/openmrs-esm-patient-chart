import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateLong, getObsByConceptKeywords } from './utils';
import { CertLogo } from './CertLogo';
import styles from './templates.scss';

interface Props {
  patientDetails: any;
  encounter: any;
}

const DeathCertificateTemplate: React.FC<Props> = ({ patientDetails, encounter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const obs = encounter?.obs || [];
  const doctorName = encounter?.provider && encounter.provider !== '--' ? encounter.provider : '';
  const formattedDob = formatDateLong(patientDetails?.birthDate || '', locale);
  const formattedDate = formatDateLong(encounter?.rawDatetime || '', locale);

  const lieu = getObsByConceptKeywords(obs, 'lieu', 'ville', 'city', 'fait');
  const causeOfDeath = getObsByConceptKeywords(obs, 'cause', 'death', 'décès', 'deces', 'mort');
  const dateOfDeath = formatDateLong(
    getObsByConceptKeywords(obs, 'date décès', 'date deces', 'date death', 'date of death'),
    locale,
  );
  const placeOfDeath = getObsByConceptKeywords(obs, 'lieu décès', 'lieu deces', 'place of death', 'lieu mort');

  return (
    <div className={styles.certFullPage}>
      <div className={styles.certHeader}>
        <CertLogo />
      </div>

      <h1 className={styles.certTitle}>{t('deathCertTitle')}</h1>

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
          <span className={styles.certSectionLabel}>{t('patientConcerned')}</span>
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
            {patientDetails?.address && (
              <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                <span className={styles.fieldLabel}>{t('address')}</span>
                <span className={styles.fieldValue}>{patientDetails.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Death info — only fields that have values ── */}
        {(dateOfDeath || placeOfDeath || causeOfDeath) && (
          <div className={styles.certSection}>
            <span className={styles.certSectionLabel}>{t('deathInfoSection')}</span>
            <div className={styles.fieldGrid}>
              {dateOfDeath && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('deathDate')}</span>
                  <span className={styles.fieldValue}>{dateOfDeath}</span>
                </div>
              )}
              {placeOfDeath && (
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>{t('deathPlace')}</span>
                  <span className={styles.fieldValue}>{placeOfDeath}</span>
                </div>
              )}
              {causeOfDeath && (
                <div className={`${styles.fieldItem} ${styles.fieldGridFull}`}>
                  <span className={styles.fieldLabel}>{t('causeOfDeath')}</span>
                  <span className={styles.fieldValue}>{causeOfDeath}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.closingStatement}>{t('deathCertClosing')}</div>

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

export default DeathCertificateTemplate;
