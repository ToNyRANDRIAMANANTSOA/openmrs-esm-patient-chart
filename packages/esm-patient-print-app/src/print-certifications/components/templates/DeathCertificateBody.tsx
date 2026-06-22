import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { formatDateLong, getObsByConceptKeywords } from './utils';

function extractHHmm(isoStr: string): string {
  const match = isoStr?.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : '';
}

const DeathCertificateBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';

  if (isLoadingEncounters) return null;

  const obs = certificate.obs;
  const dateOfDeath = getObsByConceptKeywords(obs, 'date of death', 'date de décès', 'death');
  const timeOfEvent = getObsByConceptKeywords(obs, 'time of event', 'heure', 'time');
  const causeOfDeath = getObsByConceptKeywords(obs, 'cause of death', 'cause du décès', 'cause');
  const location = getObsByConceptKeywords(obs, 'location of death', 'lieu', 'location');

  const formattedDate = dateOfDeath ? formatDateLong(dateOfDeath, locale) : '';
  const formattedTime = timeOfEvent ? extractHHmm(timeOfEvent) : '';

  return (
    <section className={styles.block}>
      {/*
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('deathCertificateDetails', 'Death certificate details:')}</strong>
        <span>
          <strong>{t('dateIssued', 'Date issued:')}</strong>{' '}
          {certificate.encounter?.encounterDatetime && formatDateLong(certificate.encounter.encounterDatetime, locale)}
        </span>
      </div>
      <table className={styles.printPrescription}>
        <thead>
          <tr>
            <th>{t('field', 'Field')}</th>
            <th>{t('value', 'Value')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingEncounters ? (
            <tr><td colSpan={2}><Loading withOverlay={false} small /></td></tr>
          ) : rows.length > 0 ? (
            rows.map((obs, index) => (
              <tr key={obs.uuid ?? index}>
                <td>{obs.concept?.display}</td>
                <td>{getObsValue(obs)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={2}>{t('noDataRecorded', 'No data recorded')}</td></tr>
          )}
        </tbody>
      </table>
      */}
      <p className={styles.bodyLong01}>
        {t('certBody.death.having', 'Having confirmed the death occurring on')} <strong>{formattedDate || '—'}</strong>
        {formattedTime && (
          <>
            {' '}
            {t('certBody.death.at', 'at')} <strong>{formattedTime}</strong>
          </>
        )}
        {location && (
          <>
            {', '}
            {t('certBody.death.in', 'in')} <strong>{location}</strong>
          </>
        )}
        .
      </p>
      {causeOfDeath && (
        <p className={styles.bodyLong01}>
          <strong>{t('certBody.death.causeLabel', 'Cause of death:')}</strong> {causeOfDeath}.
        </p>
      )}
    </section>
  );
};

export default DeathCertificateBody;
