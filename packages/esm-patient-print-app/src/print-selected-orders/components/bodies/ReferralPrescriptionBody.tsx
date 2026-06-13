import React from 'react';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';

const ReferralPrescriptionBody: React.FC<PrescriptionBodyProps> = ({ prescription, formatDate }) => {
  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>Referral Details:</strong>

          <span>
            <strong>Date issued:</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        {prescription.orders.map((order) => (
          <div key={order.uuid} className={styles.referralCard}>
            <p>
              <strong>Referral:</strong> {order.concept?.display ?? order.display}
            </p>

            <p>
              <strong>Urgency:</strong> {order.urgency ?? '--'}
            </p>

            <p>
              <strong>Reason:</strong> {order.orderReason?.display ?? order.orderReasonNonCoded ?? '--'}
            </p>

            <p>
              <strong>Instructions:</strong> {order.instructions ?? '--'}
            </p>
          </div>
        ))}
      </section>

      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>Please bring this referral document to the receiving facility.</p>
          <p>Supporting reports should accompany this referral.</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>Electronically generated referral request</p>
        </div>
      </footer>
    </>
  );
};

export default ReferralPrescriptionBody;
