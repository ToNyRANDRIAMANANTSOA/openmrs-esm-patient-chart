import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button, Loading, ModalBody, ModalFooter } from '@carbon/react';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import { useSession, type Order } from '@openmrs/esm-framework';
import styles from './print-selected-orders.scss';
// import PrintableEncounterReport from './print-print-selected-orders-preview.component';
import { usePrescriptions } from '../hooks/usePrescriptions';
import PrintablePrescription from './printable-prescription.component';

interface PrintSelectedOrdersModalProps {
  // encounter: any;
  selectedOrders: Array<Order>;
  closeModal: () => void;
  patient: fhir.Patient;
}

const PrintSelectedOrdersModal: React.FC<PrintSelectedOrdersModalProps> = ({ selectedOrders, patient, closeModal }) => {
  const { t } = useTranslation();
  const contentToPrintRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  // const { sessionLocation } = useSession();
  // const location = sessionLocation?.display;

  const dateOfIssue = new Date().toISOString();
  const patientName = `${patient?.identifier[0]?.value}-${patient?.name[0]?.text}`.replace(/ /g, '-');

  const { prescriptions, isLoadingEncounters, isLoadingProviders, isLoading } = usePrescriptions({
    orders: selectedOrders,
    patient,
  });

  // useEffect(() => {
  //   console.log('prescriptions', prescriptions);
  //   console.log('contentToPrintRef.current', contentToPrintRef.current);
  // }, [prescriptions]);

  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    // contentRef: contentToPrintRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      closeModal();
    },
    // onPrintError: (errorLocation, error) => {
    //   console.log('errorLocation', errorLocation, error);
    //   console.log('contentToPrintRef.current', contentToPrintRef.current);
    // },
    documentTitle: `MDK-Prescriptions-${patientName}-${dateOfIssue}`,
    pageStyle: `
      @page { margin: 1.5cm; size: A4; }

      @media print {
        @page {
          size: A4 portrait;
          margin: 1.5cm 2cm;
        }

        body {
          height: auto !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        #printOut { width: 100vw !important; }
      }
    `,
  });

  return (
    <>
      <ModalBody className={classNames(styles.modalBody, styles.modalContentWrapper)}>
        <div className={styles.previewPanel}>
          <div ref={contentToPrintRef} style={{ width: '100%' }} id="printOut">
            {prescriptions.map((prescription, index) => (
              <React.Fragment key={prescription.id}>
                <PrintablePrescription
                  index={index}
                  prescription={prescription}
                  isLoadingProviders={isLoadingProviders}
                  isLoadingEncounters={isLoadingEncounters}
                />
                <PrescriptionDivider currentDocumentIndex={index + 1} documentsTotal={prescriptions.length} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" onClick={handlePrint} disabled={isPrinting || isLoading}>
          {(isPrinting || isLoading) && <Loading withOverlay={false} small description={t('loading', 'Loading')} />}
          {isPrinting ? t('generatingPdf', 'Generating PDF...') : t('print', 'Print')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default PrintSelectedOrdersModal;

type PrescriptionDividerProps = {
  currentDocumentIndex: number;
  documentsTotal: number;
};

export const PrescriptionDivider: React.FC<PrescriptionDividerProps> = ({ currentDocumentIndex, documentsTotal }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.prescriptionDivider}>
      <div className={styles.dividerLabel}>
        {t('documentOfTotal', 'Document #{{current}} / {{total}}', {
          current: currentDocumentIndex,
          total: documentsTotal,
        })}
      </div>

      <div className={styles.dividerGradient} />
    </div>
  );
};
