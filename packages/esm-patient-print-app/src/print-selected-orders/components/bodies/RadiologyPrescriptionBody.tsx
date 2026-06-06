import React from 'react';
import { Loading } from '@carbon/react';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';

const RadiologyPrescriptionBody: React.FC<PrescriptionBodyProps> = ({
  prescription,
  isLoadingEncounters,
  formatDate,
}) => {
  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>Radiology Request Details:</strong>

          <span>
            <strong>Date issued:</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        <table className={styles.printPrescription}>
          <thead>
            <tr>
              <th>Exam Requested</th>
              <th>Urgency</th>
              <th>Clinical History</th>
              <th>Notes</th>
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
          <p>Bring previous imaging reports if available.</p>
          <p>Radiologist interpretation should be reviewed by the clinician.</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>Electronically generated imaging request</p>
        </div>
      </footer>
    </>
  );
};

export default RadiologyPrescriptionBody;
