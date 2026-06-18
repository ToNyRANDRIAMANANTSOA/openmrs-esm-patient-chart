import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../printable-prescription.scss';
import { type PrescriptionBodyProps } from './types';
import { getOrderTestName } from '../../utils/get-order-name';
import { translateFrom } from '@openmrs/esm-framework';
import { capitalize } from 'lodash-es';

const patientChartAppModuleName = '@openmrs/esm-patient-chart-app';

// Inspired by openmrs-esm-patient-chart/packages/esm-patient-common-lib/src/orders/useOrders.ts
// See the Urgency enum in https://github.com/openmrs/openmrs-core/blob/492dcd35b85d48730bd19da48f6db146cc882c22/api/src/main/java/org/openmrs/Order.java
export const urgencyMap = {
  ROUTINE: translateFrom(patientChartAppModuleName, 'Routine'),
  STAT: translateFrom(patientChartAppModuleName, 'Stat'),
  ON_SCHEDULED_DATE: translateFrom(patientChartAppModuleName, 'On scheduled date'),

  default: translateFrom(patientChartAppModuleName, 'Routine'),
};
// export type OrderUrgency = 'ROUTINE' | 'STAT' | 'ON_SCHEDULED_DATE';

const TestPrescriptionBody: React.FC<PrescriptionBodyProps> = ({ prescription, isLoadingEncounters, formatDate }) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>{t('laboratoryRequestDetails', 'Laboratory Request Details:')}</strong>

          <span>
            <strong>{t('dateIssued', 'Date issued:')}</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        <table className={styles.printPrescription}>
          <thead>
            <tr>
              <th>{t('testRequested', 'Test Requested')}</th>
              <th>{t('urgency', 'Urgency')}</th>
              <th>{t('reference', 'Reference')}</th>
              {/* <th>Specimen Source</th> */}
            </tr>
          </thead>

          <tbody>
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small />
            ) : (
              prescription.orders.map((order) => (
                <React.Fragment key={order.uuid}>
                  <tr>
                    <td>
                      <strong>{capitalize(getOrderTestName(order))}</strong>
                    </td>

                    <td>
                      {order.urgency ? urgencyMap[order.urgency] : '--'}
                      {order.scheduledDate && ' : ' + formatDate(order.scheduledDate)}
                    </td>

                    <td>{order.accessionNumber ?? '--'}</td>

                    {/* <td>
                      {order.specimenSource?.display ?? '--'}
                    </td> */}
                  </tr>

                  {order.instructions && (
                    <tr className={styles.prescriptionNotes}>
                      <td colSpan={4}>
                        <strong>{t('notes', 'Notes:')}</strong> {capitalize(order.instructions)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>
            <u>
              <strong>{t('laboratoryNotices', 'LABORATORY NOTICES:')}</strong>
            </u>
          </p>

          <p>{t('presentRequestAtLaboratory', 'Please present this request at the laboratory.')}</p>
          <p>
            {t('followSpecimenCollectionInstructions', 'Follow specimen collection instructions provided by staff.')}
          </p>
          <p>
            {t('resultsInterpretedByQualifiedClinician', 'Results should be interpreted by a qualified clinician.')}
          </p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>
            {t('electronicallyGeneratedLaboratoryRequest', 'Electronically generated laboratory request')}
          </p>

          <p className={styles.confidentialNotice}>
            {t('confidentialMedicalInfo', 'Confidential medical information')}
          </p>
        </div>
      </footer>
    </>
  );
};

export default TestPrescriptionBody;
