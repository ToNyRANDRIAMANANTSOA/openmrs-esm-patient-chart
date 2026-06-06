import React from 'react';
import { Loading, Tag, Tooltip } from '@carbon/react';
import { capitalize } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import styles from '../printable-prescription.scss';

import { type PrescriptionBodyProps } from './types';
import { getOrderDrugName } from '../../utils/get-order-name';

const DrugPrescriptionBody: React.FC<PrescriptionBodyProps> = ({ prescription, isLoadingEncounters, formatDate }) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>Prescription details:</strong>

          <span>
            <strong>Date issued:</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription.encounter.encounterDatetime)}
          </span>
        </div>

        <table className={styles.printPrescription}>
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Dosage</th>
              <th>Start Date</th>
              <th>Quantity</th>
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
                      <strong>{capitalize(getOrderDrugName(order))}</strong>{' '}
                      {order.drug?.strength && <>&mdash; {order.drug?.strength.toLowerCase()}</>}{' '}
                      {order.drug?.dosageForm?.display && <>&mdash; {order.drug.dosageForm.display.toLowerCase()}</>}
                      {order.dateStopped && (
                        <Tooltip align="right" label={<>{formatDate(order.dateStopped)}</>}>
                          <Tag type="gray" className={styles.tag}>
                            {t('discontinued', 'Discontinued')}
                          </Tag>
                        </Tooltip>
                      )}
                    </td>
                    <td>
                      <span className={styles.dosage}>
                        {order.dose != null && (
                          <>
                            {order.dose} {order.doseUnits?.display?.toLowerCase()}
                          </>
                        )}
                        {order.dose != null && order.dosingType === 'org.openmrs.FreeTextDosingInstructions' && ' '}
                        {order.dosingType === 'org.openmrs.FreeTextDosingInstructions' && (
                          <>{capitalize(order.dosingInstructions)}</>
                        )}
                      </span>
                      <> &mdash; </>
                      {order.route?.display && <>{order.route?.display.toLowerCase()} </>}
                      {order.frequency?.display && <>&mdash; {order.frequency?.display.toLowerCase()} </>}
                      {order.duration != null && (
                        <>
                          {(order.dose != null || order.route?.display || order.frequency?.display) && <>&mdash; </>}
                          {t('medicationDurationAndUnit', 'for {{duration}} {{durationUnit}}', {
                            duration: order.duration,
                            durationUnit: order.durationUnits?.display?.toLowerCase(),
                          })}{' '}
                        </>
                      )}
                      {order.duration == null &&
                        (order.dose != null || order.route?.display || order.frequency?.display) && (
                          <>&mdash; {t('medicationIndefiniteDuration', 'Indefinite duration').toLowerCase()} </>
                        )}
                      {order.numRefills != null && order.numRefills !== 0 && (
                        <span>
                          {(order.dose != null ||
                            order.route?.display ||
                            order.frequency?.display ||
                            order.duration != null) && <> &mdash; </>}
                          <span className={styles.label01}>{t('refills', 'Refills').toUpperCase()}</span>{' '}
                          {order.numRefills}
                        </span>
                      )}
                    </td>
                    <td>{formatDate(order?.scheduledDate) ?? '--'}</td>
                    <td>{order?.quantity ? order?.quantity + ' ' + order?.quantityUnits?.display : '--'}</td>
                  </tr>

                  {(order.instructions ||
                    (order.dosingType === 'org.openmrs.SimpleDosingInstructions' && order.dosingInstructions)) && (
                    <tr className={styles.prescriptionNotes}>
                      <td colSpan={4}>
                        <strong>Notes:</strong>{' '}
                        {order.dosingType === 'org.openmrs.SimpleDosingInstructions' &&
                          capitalize(order.dosingInstructions)}{' '}
                        {order.instructions && <> &mdash; &nbsp; {capitalize(order.instructions)}</>}
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
              <strong>MEDICATION NOTICES:</strong>
            </u>
          </p>

          <p>This prescription is intended only for the named patient.</p>
          <p>Follow the prescribed dosage and duration exactly as instructed.</p>
          <p>Keep medicines out of reach of children.</p>
          <p>Contact your healthcare provider if adverse reactions occur.</p>
        </div>

        <div className={styles.footerColumn}>
          <p className={styles.generatedNotice}>Electronically generated prescription</p>

          <p className={styles.confidentialNotice}>Confidential medical information</p>
        </div>
      </footer>
    </>
  );
};

export default DrugPrescriptionBody;
