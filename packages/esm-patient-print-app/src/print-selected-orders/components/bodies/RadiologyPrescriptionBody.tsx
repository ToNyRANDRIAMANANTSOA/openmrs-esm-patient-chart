import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';

const RadiologyPrescriptionBody: React.FC<PrescriptionBodyProps> = ({
  prescription,
  isLoadingEncounters,
  formatDate,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>{t('radiologyRequestDetails', 'Radiology Request Details:')}</strong>

          <span>
            <strong>{t('dateIssued', 'Date issued:')}</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        <table className={styles.printPrescription}>
          <thead>
            <tr>
              <th>{t('examRequested', 'Exam Requested')}</th>
              <th>{t('urgency', 'Urgency')}</th>
              <th>{t('clinicalHistory', 'Clinical History')}</th>
              <th>{t('notes', 'Notes:')}</th>
            </tr>
          </thead>

          <tbody>
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small />
            ) : (
              prescription.orders.map((order) => (
                <tr key={order.uuid}>
                  <td>{order.concept?.display ?? order.display}</td>
                  <td>{order.urgency ?? '--'}</td>
                  <td>{order.clinicalHistory ?? '--'}</td>
                  <td>{order.instructions ?? '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>{t('bringPreviousImagingReports', 'Bring previous imaging reports if available.')}</p>
          <p>{t('radiologistInterpretation', 'Radiologist interpretation should be reviewed by the clinician.')}</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>
            {t('electronicallyGeneratedImagingRequest', 'Electronically generated imaging request')}
          </p>
        </div>
      </footer>
    </>
  );
};

export default RadiologyPrescriptionBody;
