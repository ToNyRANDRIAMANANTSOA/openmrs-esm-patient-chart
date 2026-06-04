import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

import styles from './print-selected-orders-preview.scss';
import { type Prescription } from './types/prescription';
import { formatDate as formatDateUtils, type Order } from '@openmrs/esm-framework';
import { Loading, Tag, Tooltip } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash-es';

const formatDate = (dateString: string) => formatDateUtils(new Date(dateString), { noToday: true });

export function getOrderDrugName(order: Order) {
  return order.drugNonCoded ?? order.drug?.display ?? order.concept?.display ?? order.display;
}

export const prescriptionTypeMap = {
  'Drug Order': {
    translationKey: 'drugPrescription',
    defaultLabel: 'Medical Prescription',
  },

  'Test Order': {
    translationKey: 'laboratoryRequest',
    defaultLabel: 'Laboratory Request',
  },

  'Radiology Order': {
    translationKey: 'radiologyRequest',
    defaultLabel: 'Radiology Request',
  },

  'Imaging Order': {
    translationKey: 'imagingRequest',
    defaultLabel: 'Imaging Request',
  },

  'Procedure Order': {
    translationKey: 'procedureRequest',
    defaultLabel: 'Procedure Request',
  },

  'Referral Order': {
    translationKey: 'referralRequest',
    defaultLabel: 'Referral Request',
  },
} as const;

export function getPrescriptionTypeMetadata(orderTypeName?: string) {
  return (
    prescriptionTypeMap[orderTypeName] ?? {
      translationKey: 'prescription',
      defaultLabel: 'Prescription',
    }
  );
}

type PrintablePrescriptionProps = {
  prescription: Prescription;
  isLoadingProviders?: boolean;
  isLoadingEncounters?: boolean;
  index?: number;
};

const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({
  prescription,
  isLoadingProviders,
  isLoadingEncounters,
  index,
}) => {
  // console.log('prescription', prescription);

  // console.log(
  //   'new Date(prescription?.encounter?.encounterDatetime)',
  //   typeof prescription?.encounter?.encounterDatetime,
  //   '---',
  //   prescription?.encounter?.encounterDatetime,
  //   '---',
  //   prescription?.encounter?.encounterDatetime?.slice(0, 23) + 'Z',
  //   '---',
  //   prescription?.encounter?.encounterDatetime?.slice(0, 23) + 'Z',
  // );
  // console.log(
  //   'formatDate(prescription?.encounter?.encounterDatetime)',
  //   formatDate(prescription?.encounter?.encounterDatetime),
  // );

  const { t } = useTranslation();
  const { translationKey, defaultLabel } = getPrescriptionTypeMetadata(prescription?.metadata?.prescriptionType);

  return (
    <div className={styles.printWrapper}>
      {/* HEADER */}
      <div className={styles.printHeader}>
        <div className={styles.printLogoPlusText}>
          <div className={styles.printLogoText}>
            <h3> {t(translationKey, defaultLabel).toUpperCase()}</h3>
          </div>

          {prescription?.facility?.logo?.src ? (
            <img
              className={styles.printLogo}
              src={prescription?.facility?.logo?.src}
              alt={prescription?.facility?.logo?.alt}
            />
          ) : prescription?.facility?.logo?.name ? (
            <span>{prescription?.facility?.logo?.name}</span>
          ) : (
            // OpenMRS Logo
            <svg role="img" width={110} height={40} viewBox="0 0 380 119" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M40.29 40.328a27.755 27.755 0 0 1 19.688-8.154c7.669 0 14.613 3.102 19.647 8.116l.02-18.54A42.835 42.835 0 0 0 59.978 17c-7.089 0-13.813 1.93-19.709 4.968l.021 18.36ZM79.645 79.671a27.744 27.744 0 0 1-19.684 8.154c-7.67 0-14.614-3.101-19.651-8.116l-.02 18.54A42.857 42.857 0 0 0 59.96 103a42.833 42.833 0 0 0 19.672-4.751l.013-18.578ZM40.328 79.696c-5.038-5.037-8.154-11.995-8.154-19.685 0-7.669 3.102-14.612 8.116-19.65l-18.54-.02A42.85 42.85 0 0 0 17 60.012a42.819 42.819 0 0 0 4.752 19.672l18.576.013ZM79.634 40.289a27.753 27.753 0 0 1 8.154 19.688 27.744 27.744 0 0 1-8.117 19.646l18.542.02a42.842 42.842 0 0 0 4.749-19.666c0-7.09-1.714-13.779-4.751-19.675l-18.577-.013ZM156.184 60.002c0-8.748-6.118-15.776-15.025-15.776-8.909 0-15.025 7.028-15.025 15.776 0 8.749 6.116 15.78 15.025 15.78 8.907 0 15.025-7.031 15.025-15.78Zm-34.881 0c0-11.482 8.318-19.958 19.856-19.958 11.536 0 19.855 8.477 19.855 19.959 0 11.484-8.319 19.964-19.855 19.964-11.538 0-19.856-8.48-19.856-19.965ZM179.514 75.54c5.507 0 9.05-4.14 9.05-9.482 0-5.341-3.543-9.483-9.05-9.483-5.505 0-9.046 4.142-9.046 9.483 0 5.342 3.541 9.482 9.046 9.482ZM166.22 53.306h4.248v3.704h.11c2.344-2.725 5.449-4.36 9.154-4.36 8.014 0 13.408 5.67 13.408 13.408 0 7.63-5.613 13.406-12.752 13.406-4.58 0-8.231-2.29-9.81-5.178h-.11V90.87h-4.248V53.306ZM217.773 63.768c-.163-4.305-3-7.193-7.686-7.193-4.685 0-7.79 2.888-8.335 7.193h16.021Zm3.653 10.412c-3.001 3.868-6.596 5.284-11.339 5.284-8.01 0-12.914-5.993-12.914-13.406 0-7.901 5.559-13.407 13.08-13.407 7.196 0 12.096 4.906 12.096 13.354v1.362h-20.597c.325 4.413 3.704 8.173 8.335 8.173 3.65 0 6.105-1.307 8.12-3.868l3.219 2.508ZM227.854 59.356c0-2.346-.216-4.36-.216-6.05h4.031c0 1.363.11 2.777.11 4.195h.11c1.144-2.505 4.306-4.85 8.5-4.85 6.705 0 9.699 4.252 9.699 10.41v15.748h-4.248v-15.31c0-4.253-1.856-6.924-5.833-6.924-5.503 0-7.903 3.979-7.903 9.811V78.81h-4.25V59.356ZM259.211 41.008h6.708L278.8 70.791h.107l12.982-29.782h6.549v37.99h-4.506V47.124h-.106L280.192 79h-2.738l-13.629-31.875h-.107V79h-4.507V41.01ZM312.392 57.752h4.023c4.992 0 11.487 0 11.487-6.282 0-5.47-4.776-6.276-9.177-6.276h-6.333v12.558Zm-4.506-16.744h9.711c7.352 0 15.132 1.072 15.132 10.462 0 5.527-3.594 9.125-9.495 10.037L334.018 79h-5.525l-10.304-17.063h-5.797V79h-4.506V41.01ZM358.123 47.712c-1.506-2.413-4.187-3.486-6.926-3.486-3.973 0-8.1 1.88-8.1 6.385 0 3.49 1.931 5.047 7.994 6.98 5.903 1.878 11.377 3.809 11.377 11.267 0 7.567-6.495 11.11-13.36 11.11-4.402 0-9.125-1.45-11.7-5.262l3.862-3.165c1.61 2.794 4.83 4.24 8.105 4.24 3.862 0 8.263-2.253 8.263-6.601 0-4.669-3.165-5.474-9.928-7.728-5.366-1.771-9.442-4.134-9.442-10.463 0-7.298 6.277-10.945 12.929-10.945 4.241 0 7.836 1.178 10.625 4.45l-3.699 3.218Z"
              />
            </svg>
          )}

          {/* <img
            className={styles.printLogo}
            width="155"
            src="http://mediaiko.ets-ralaivao.mg/openmrs/spa/img/Logo-Mediaiko-Rectangular-Light-border-50.png"
            alt="logo"
          /> */}
        </div>

        <div className={styles.printInfo}>
          <div className={styles.providerInfo}>
            {isLoadingProviders ? (
              <Loading withOverlay={false} small description="Loading" />
            ) : (
              <div>
                {/* <strong>Provider:</strong>  */}
                <span>{prescription?.provider?.attributes?.title}.&nbsp;</span>
                <span>{prescription?.provider?.name}</span>
                <br />
                {/* <strong>Spécialité:</strong>  */}
                <span>{prescription?.provider?.attributes?.specialties}</span>
                <br />
                <strong>{prescription?.provider?.attributes?.licenseType ?? 'Nº Ordre'}:</strong>{' '}
                <span>{prescription?.provider?.attributes?.licenseNb}</span>
                {prescription?.provider?.attributes?.phoneNumber && (
                  <>
                    <br />
                    <strong>Phone:</strong> <span>{prescription?.provider?.attributes?.phoneNumber}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={styles.facilityAddress}>
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small description="Loading" />
            ) : (
              <>
                <strong className={styles.clinicInfo}>{prescription?.encounter?.visit?.location?.name}</strong>
                <br />
                <span>
                  <strong>Contact:</strong>{' '}
                  <span>{prescription?.encounter?.visit?.location?.attributes?.phoneNumber1}</span>{' '}
                  {prescription?.encounter?.visit?.location?.attributes?.phoneNumber2 && (
                    <span>{prescription?.encounter?.visit?.location?.attributes?.phoneNumber2}</span>
                  )}
                  <br />
                  <strong>Email:</strong> <span>{prescription?.encounter?.visit?.location?.attributes?.email}</span>
                </span>
                <br />
                <span>{prescription?.encounter?.visit?.location?.attributes?.addressDisplay}</span>
                {/* Lot II A 123, Analamahitsy, Antananarivo, Madagascar */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* WATERMARK */}
      {/* <img className={styles.watermark} width="350" src="/images/mediaiko-watermark.png" alt="watermark-logo" /> */}

      {/* PATIENT INFO */}
      <div className={styles.patientInfo}>
        <table>
          <tbody>
            <tr>
              <td rowSpan={4} className={styles.qrCodeCell}>
                <QRCodeSVG
                  value={'{"uuid":"' + prescription?.patient?.uuid + '","res":"patient"}'}
                  size={96}
                  title="Patient ID"
                />
                <br />
                <code>{prescription?.patient?.identifiers?.[0]}</code>
              </td>
              <td colSpan={3}>
                <strong>Patient Name:</strong> <span className={styles.value}>{prescription?.patient?.display}</span>
              </td>
              <td rowSpan={5} className={styles.qrCodeCell}>
                {isLoadingEncounters ? (
                  <Loading withOverlay={false} small description="Loading" />
                ) : (
                  <>
                    <QRCodeSVG
                      value={'{"uuid":"' + prescription?.encounter?.visit?.uuid + '","res":"visit"}'}
                      size={96}
                      title="Visit ID"
                    />
                    <span>
                      <br />
                      <strong>Visit Details</strong>
                      {/* <strong>Visit Date:</strong> <br />
                      {formatDate(prescription?.encounter?.visit?.startDatetime)} */}
                    </span>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Age:</strong> {prescription?.patient?.age}
              </td>

              <td>
                <strong>Gender:</strong> {prescription?.patient?.gender}
              </td>

              <td>
                <strong>Weight:</strong> {prescription?.patient?.weightKg}
              </td>
            </tr>

            {/* <tr>
              <td>
                <strong>Date of birth:</strong> {formatDate(prescription?.patient?.birthdate)}
              </td>

              <td>
                <strong>Age:</strong> {prescription?.patient?.age}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Gender:</strong> {prescription?.patient?.gender}
              </td>

              <td>
                <strong>Weight:</strong> {prescription?.patient?.weightKg}
              </td>
            </tr> */}

            <tr>
              <td colSpan={3}>
                <strong>Allergies:</strong>{' '}
                {prescription?.patient?.allergies?.length
                  ? prescription?.patient?.allergies?.join(', ')
                  : 'No allergies recorded'}
              </td>
            </tr>
            {/* <tr>
              <td></td>
            </tr> */}

            {/* <tr>
              <td colSpan={3}>
                <strong>Tel no:</strong> +261 34 12 345 67 | +261 32 12 345 67
              </td>
            </tr> */}

            {/* <tr>
              <td colSpan={3}>
                <strong>Email:</strong> jean.rakoto@email.com
              </td>
            </tr> */}

            {/* <tr>
              <td colSpan={4}>
                <strong>Address:</strong> Lot II A 123 Analamahitsy, Antananarivo
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <strong>District:</strong> Analamanga
              </td>

              <td colSpan={2}>
                <strong>Region:</strong> Analamanga, Madagascar
              </td>
            </tr> */}

            {/* <tr>
              <td colSpan={2}>
                <strong>Diagnosis (ICD-10 code):</strong> J11 - Influenza
              </td>

            </tr> */}
          </tbody>
        </table>
      </div>

      {/* TREATMENT */}
      <section className={styles.block}>
        <div className={styles.sectionTitleWrapper}>
          <strong>Prescription details:</strong>

          <span>
            <strong>Date issued:</strong>{' '}
            {prescription?.encounter?.encounterDatetime && formatDate(prescription?.encounter?.encounterDatetime)}{' '}
            {/*TODO: How to include time in the formated output, tried this but didn't work: ?.slice(0, 23) + 'Z' */}
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
            {/* <tr>
              <td>Paracetamol 500mg</td>
              <td>1 tablet, 3 times daily after meals</td>
              <td>06 May 2026</td>
              <td>15 tablets</td>
            </tr>

            <tr className={styles.prescriptionNotes}>
              <td colSpan={4}>
                <strong>Notes:</strong> Take with water. Do not exceed 3g/day.
              </td>
            </tr>

            <tr>
              <td>Amoxicillin 500mg</td>
              <td>1 capsule, 3 times daily for 7 days</td>
              <td>06 May 2026</td>
              <td>21 capsules</td>
            </tr> */}

            {/* Example dynamic rendering later */}
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small description="Loading" />
            ) : (
              prescription?.orders?.map((order, index) => (
                <React.Fragment key={index}>
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
                        {order.dosingType === 'org.openmrs.SimpleDosingInstructions' && order.dosingInstructions}{' '}
                        {order.instructions && <> &mdash; &nbsp; {order.instructions}</>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* FOOTER / NOTICES */}
      <footer className={styles.prescriptionFooter}>
        <div className={styles.footerColumn}>
          <p>
            <u>
              <strong>NOTICES:</strong>
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
    </div>
  );
};

export default PrintablePrescription;
