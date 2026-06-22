import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Loading, ModalBody, ModalFooter } from '@carbon/react';
import { useReactToPrint } from 'react-to-print';
import PrintableCertificate from './printable-certificates.component';
import { useCertificates } from '../hooks/useCertificates';
import styles from './print-certifications.scss';
import { type MappedEncounter } from '../types/certifications';

interface PrintCertificationsModalProps {
  encounters: Array<MappedEncounter>;
  patient: fhir.Patient;
  closeModal: () => void;
}

const PrintCertificationsModal: React.FC<PrintCertificationsModalProps> = ({ encounters, patient, closeModal }) => {
  const { t } = useTranslation();
  const contentToPrintRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const { certificates, isLoadingEncounters, isLoadingProviders, isLoading } = useCertificates({ encounters, patient });

  const dateOfIssue = new Date().toISOString();
  const patientName = `${patient?.identifier[0]?.value}-${patient?.name[0]?.text}`.replace(/ /g, '-');

  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      closeModal();
    },
    documentTitle: `MDK-Certifications-${patientName}-${dateOfIssue}`,
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

        #certificatesPrintOut { width: 100vw !important; }
      }
    `,
  });

  return (
    <>
      <ModalBody className={classNames(styles.modalBody, styles.modalContentWrapper)}>
        <div className={styles.previewPanel}>
          <div ref={contentToPrintRef} style={{ width: '100%' }} id="certificatesPrintOut">
            {certificates.map((certificate, index) => (
              <React.Fragment key={certificate.id ?? index}>
                <PrintableCertificate
                  certificate={certificate}
                  isLoadingProviders={isLoadingProviders}
                  isLoadingEncounters={isLoadingEncounters}
                  index={index}
                />
                <CertificationDivider currentDocumentIndex={index + 1} documentsTotal={certificates.length} />
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
          {isPrinting
            ? t('generatingPdf', 'Generating PDF...')
            : isLoading
              ? t('loadingData', 'Loading data...')
              : t('print', 'Print')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default PrintCertificationsModal;

type CertificationDividerProps = {
  currentDocumentIndex: number;
  documentsTotal: number;
};

export const CertificationDivider: React.FC<CertificationDividerProps> = ({ currentDocumentIndex, documentsTotal }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.certificationDivider}>
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
