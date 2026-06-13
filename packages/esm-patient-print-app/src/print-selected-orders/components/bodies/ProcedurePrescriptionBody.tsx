import React from 'react';
import { Loading } from '@carbon/react';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';

const ProcedurePrescriptionBody: React.FC<PrescriptionBodyProps> = ({
  prescription,
  isLoadingEncounters,
  formatDate,
}) => {
  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>Procedure Request Details:</strong>

          <span>
            <strong>Date issued:</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        <table className={styles.printPrescription}>
          <thead>
            <tr>
              <th>Procedure</th>
              <th>Scheduled Date</th>
              <th>Urgency</th>
              <th>Instructions</th>
            </tr>
          </thead>

          <tbody>
            {prescription.orders.map((order) => (
              <tr key={order.uuid}>
                <td>{order.concept?.display ?? order.display}</td>
                <td>{order.scheduledDate ? formatDate(order.scheduledDate) : '--'}</td>
                <td>{order.urgency ?? '--'}</td>
                <td>{order.instructions ?? '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>Please arrive before the scheduled procedure time.</p>
          <p>Follow all preparation instructions provided by your clinician.</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>Electronically generated procedure request</p>
        </div>
      </footer>
    </>
  );
};

export default ProcedurePrescriptionBody;
