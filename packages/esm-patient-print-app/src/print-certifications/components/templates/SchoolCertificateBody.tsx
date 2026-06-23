import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { formatDurationDays, getObsByConceptKeywords } from './utils';

const SchoolCertificateBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t } = useTranslation();

  if (isLoadingEncounters) return null;

  const obs = certificate.obs;
  const fitnessStatus = getObsByConceptKeywords(obs, 'fitness status', 'aptitude');
  const school = getObsByConceptKeywords(obs, 'school', 'organization', 'établissement');
  const validityRaw = getObsByConceptKeywords(obs, 'validity');
  const validity = validityRaw ? formatDurationDays(validityRaw, t('certBody.dayUnit', 'day(s)')) : '';

  return (
    <section className={styles.block}>
      {/*
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('schoolCertificateDetails', 'School certificate details:')}</strong>
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
        {t('certBody.school.declared', 'Declare that the aforementioned patient is')}{' '}
        <strong>{fitnessStatus || '—'}</strong> {t('certBody.school.forAttending', 'for attending the institution')}{' '}
        <strong>{school || '—'}</strong>.
      </p>
      {validity && (
        <p className={styles.bodyLong01}>
          {t('certBody.validity.prefix', 'This certificate is valid for')} <strong>{validity}</strong>{' '}
          {t('certBody.validity.suffix', 'from the date of issue.')}
        </p>
      )}
    </section>
  );
};

export default SchoolCertificateBody;
