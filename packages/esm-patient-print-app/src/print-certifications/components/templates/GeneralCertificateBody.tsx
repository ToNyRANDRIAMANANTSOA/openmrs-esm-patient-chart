import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { flattenObs, getObsValue } from './utils';

const GeneralCertificateBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t } = useTranslation();
  const rows = flattenObs(certificate.obs).filter((obs) => getObsValue(obs));

  return (
    <section className={styles.block}>
      {/*
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('certificateDetails', 'Certificate details:')}</strong>
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
      {isLoadingEncounters ? (
        <Loading withOverlay={false} small />
      ) : rows.length > 0 ? (
        <>
          <p className={styles.bodyLong01}>
            {t('certBody.general.followingElements', 'The following medical elements:')}
          </p>
          <dl>
            {rows.map((obs, index) => (
              <div key={obs.uuid ?? index} style={{ marginBottom: '6px' }}>
                <dt style={{ fontWeight: 600, display: 'inline' }}>{obs.concept?.display}: </dt>
                <dd style={{ display: 'inline', margin: 0 }}>{getObsValue(obs)}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className={styles.bodyLong01}>{t('noDataRecorded', 'No data recorded')}</p>
      )}
    </section>
  );
};

export default GeneralCertificateBody;
