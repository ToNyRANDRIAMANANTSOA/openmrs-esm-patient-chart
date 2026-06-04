import React from 'react';
import Barcode from 'react-barcode';
import styles from './print-selected-orders-preview.scss';

type PrintableOrdersProps = {
  selectedOrders: Array<any>;
};

const PrintableOrders: React.FC<PrintableOrdersProps> = ({ selectedOrders }) => {
  return (
    <div className={styles.printWrapper}>
      {/* HEADER */}
      <div className={styles.printHeader}>
        <div className={styles.printLogoPlusText}>
          <div className={styles.clinicInfo}>
            <h1>PRESCRIPTION MÉDICALE</h1>
          </div>

          <img
            className={styles.printLogo}
            width="155"
            src="http://mediaiko.ets-ralaivao.mg/openmrs/spa/img/Logo-Mediaiko-Rectangular-Light-border-50.png"
            alt="logo"
          />
        </div>

        <h3 className={styles.printLogoText}>Mediaiko Clinic - Antananarivo</h3>

        <div className={styles.printInfo}>
          <div className={styles.facilityAddress}>
            <span>
              <strong>Contact:</strong> +261 38 00 000 00 | +261 33 00 000 00
              <br />
              <strong>Email:</strong> contact@mediaiko.test
            </span>
            <br />
            Lot II A 123, Analamahitsy
            <br />
            Antananarivo, Madagascar
          </div>

          <div>
            <div className={styles.providerInfo}>
              <strong>Provider:</strong> <span>Dr. Toky RANDRIANARIVELO </span>
              <strong>Spécialité:</strong> <span>Medecin généraliste et urgentiste</span>
              <strong>Nº Ordre:</strong> <span>123456ABC</span>
            </div>
            <strong>Date:</strong> <span className={styles.value}>06 May 2026</span>
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
              <td colSpan={2}>
                <span>Patient ID</span>
                <div className={styles.barcodeContainer}>
                  <Barcode value="MED-2026-000123" format="CODE128" width={2} height={50} fontSize={12} displayValue />
                </div>
              </td>
              <td colSpan={2}>
                <span>
                  <strong>Visit Date:</strong> 06 May 2026
                </span>
                <div className={styles.barcodeContainer}>
                  <Barcode value="MED-2026-000123" format="CODE128" width={2} height={50} fontSize={12} displayValue />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <strong>Patient Name:</strong> <span className={styles.value}>Tahiry Michael Andriamitsinjo</span>
              </td>
              {/* <td rowSpan={5} style={{ maxWidth: '250px' }}>
                <div className={styles.barcodeWrapper}>
                  <span>Patient ID</span>
                  <div className={styles.barcodeContainer}>
                    <Barcode
                      value="MED-2026-000123"
                      format="CODE128"
                      width={2}
                      height={50}
                      fontSize={12}
                      displayValue
                    />
                  </div>

                  <br />
                  <span>
                    <strong>Visit Date:</strong> 06 May 2026
                  </span>
                  <div className={styles.barcodeContainer}>
                    <Barcode
                      value="MED-2026-000123"
                      format="CODE128"
                      width={2}
                      height={50}
                      fontSize={12}
                      displayValue
                    />
                  </div>
                </div>
              </td> */}
            </tr>

            <tr>
              <td>
                <strong>Weight:</strong> 70 kg
              </td>

              <td>
                <strong>Age:</strong> 32
              </td>

              <td>
                <strong>Sex:</strong> Male
              </td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Tel no:</strong> +261 34 12 345 67 | +261 32 12 345 67
              </td>
              <td colSpan={1}>
                <strong>Email:</strong> jean.rakoto@email.com
              </td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Address:</strong> Lot II A 123 Analamahitsy
              </td>

              <td colSpan={1}>
                <strong>Commune:</strong> Antananarivo
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <strong>District:</strong> Analamanga
              </td>

              <td colSpan={2}>
                <strong>Region:</strong> Analamanga, Madagascar
              </td>
            </tr>

            <tr>
              {/* <td colSpan={2}>
                <strong>Diagnosis (ICD-10 code):</strong> J11 - Influenza
              </td> */}

              <td colSpan={4}>
                <strong>Allergies:</strong> No allergies recorded
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TREATMENT */}
      <section className={styles.block}>
        <h3 className={styles.sectionTitle}>Treatment</h3>

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
            <tr>
              <td>Paracetamol 500mg</td>
              <td>1 tablet, 3 times daily after meals</td>
              <td>06 May 2026</td>
              <td>15 tablets</td>
            </tr>

            <tr>
              <td colSpan={4}>
                <strong>Notes:</strong> Take with water. Do not exceed 3g/day.
              </td>
            </tr>

            <tr>
              <td>Amoxicillin 500mg</td>
              <td>1 capsule, 3 times daily for 7 days</td>
              <td>06 May 2026</td>
              <td>21 capsules</td>
            </tr>

            {/* Example dynamic rendering later */}
            {selectedOrders?.map((order, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{order?.drug?.display ?? 'Drug name'}</td>
                  <td>{order?.doseInstructions ?? '--'}</td>
                  <td>{order?.startDate ?? '--'}</td>
                  <td>{order?.quantity ?? '--'}</td>
                </tr>

                {order?.comment && (
                  <tr>
                    <td colSpan={4}>
                      <strong>Notes:</strong> {order.comment}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PrintableOrders;
