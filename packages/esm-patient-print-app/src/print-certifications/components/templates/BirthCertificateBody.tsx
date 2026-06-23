import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { getObsByConceptKeywords } from './utils';

const BirthCertificateBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t } = useTranslation();

  if (isLoadingEncounters) return null;

  const obs = certificate.obs;
  const motherName = getObsByConceptKeywords(obs, "mother's name", 'mother', 'mère');

  return (
    <section className={styles.block}>
      {/*
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('birthCertificateDetails', 'Birth certificate details:')}</strong>
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
        {t('certBody.birth.theBirth', 'Declare the birth of the aforementioned child, born of')}{' '}
        <strong>{motherName || '—'}</strong>.
      </p>
      <p className={styles.bodyLong01}>
        {t('certBody.birth.issuedOnRequest', 'This certificate is issued at the request of the interested party.')}
      </p>
    </section>
  );
};

export default BirthCertificateBody;
