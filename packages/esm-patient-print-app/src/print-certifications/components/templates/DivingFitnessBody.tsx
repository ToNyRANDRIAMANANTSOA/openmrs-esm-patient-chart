import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { flattenObs, formatDateLong, getObsValue } from './utils';

const DivingFitnessBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const rows = flattenObs(certificate.obs).filter((obs) => getObsValue(obs));

  return (
    <section className={styles.block}>
      <div className={styles.sectionTitleWrapper}>
        <strong>{t('divingFitnessDetails', 'Diving fitness details:')}</strong>
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
            <tr>
              <td colSpan={2}>
                <Loading withOverlay={false} small />
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((obs, index) => (
              <tr key={obs.uuid ?? index}>
                <td>{obs.concept?.display}</td>
                <td>{getObsValue(obs)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>{t('noDataRecorded', 'No data recorded')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default DivingFitnessBody;
