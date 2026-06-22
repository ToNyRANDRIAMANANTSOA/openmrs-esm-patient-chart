import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { formatDurationDays, getObsByConceptKeywords } from './utils';

const FitToFlyBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t } = useTranslation();

  if (isLoadingEncounters) return null;

  const obs = certificate.obs;
  const fitnessStatus = getObsByConceptKeywords(obs, 'fitness status', 'aptitude');
  const passportNumber =
    getObsByConceptKeywords(obs, 'passport number', 'passport') || certificate.patient?.passportNumber;
  const remarks = getObsByConceptKeywords(obs, "doctor's remarks", 'remarks', 'remarques');
  const validityRaw = getObsByConceptKeywords(obs, 'validity');
  const validity = validityRaw ? formatDurationDays(validityRaw, t('certBody.dayUnit', 'day(s)')) : '';

  return (
    <section className={styles.block}>
      {/*
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('fitToFlyDetails', 'Fit to fly details:')}</strong>
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
        {t('certBody.fitToFly.thatThePatient', 'That the aforementioned patient, holder of passport no.')}{' '}
        <strong>{passportNumber || '—'}</strong>, {t('certBody.fitToFly.isDeclared', 'is declared')}{' '}
        <strong>{fitnessStatus || '—'}</strong> {t('certBody.fitToFly.forAirTravel', 'for air travel.')}
      </p>
      {remarks && (
        <p className={styles.bodyLong01}>
          <strong>{t('certBody.fitToFly.remarksLabel', 'Remarks:')}</strong> {remarks}
        </p>
      )}
      {validity && (
        <p className={styles.bodyLong01}>
          {t('certBody.validity.prefix', 'This certificate is valid for')} <strong>{validity}</strong>{' '}
          {t('certBody.validity.suffix', 'from the date of issue.')}
        </p>
      )}
    </section>
  );
};

export default FitToFlyBody;
