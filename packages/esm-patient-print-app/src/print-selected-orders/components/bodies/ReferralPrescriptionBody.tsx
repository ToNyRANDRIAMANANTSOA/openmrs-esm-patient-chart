import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';

const ReferralPrescriptionBody: React.FC<PrescriptionBodyProps> = ({ prescription, formatDate }) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>{t('referralDetails', 'Referral Details:')}</strong>

          <span>
            <strong>{t('dateIssued', 'Date issued:')}</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        {prescription.orders.map((order) => (
          <div key={order.uuid} className={styles.referralCard}>
            <p>
              <strong>{t('referral', 'Referral:')}</strong> {order.concept?.display ?? order.display}
            </p>

            <p>
              <strong>{t('urgency', 'Urgency:')}</strong> {order.urgency ?? '--'}
            </p>

            <p>
              <strong>{t('reason', 'Reason:')}</strong>{' '}
              {order.orderReason?.display ?? order.orderReasonNonCoded ?? '--'}
            </p>

            <p>
              <strong>{t('instructions', 'Instructions:')}</strong> {order.instructions ?? '--'}
            </p>
          </div>
        ))}
      </section>

      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>{t('pleasesBringReferralDocument', 'Please bring this referral document to the receiving facility.')}</p>
          <p>{t('supportingReports', 'Supporting reports should accompany this referral.')}</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>
            {t('electronicallyGeneratedReferralRequest', 'Electronically generated referral request')}
          </p>
        </div>
      </footer>
    </>
  );
};

export default ReferralPrescriptionBody;
