import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Loading, ModalBody, ModalFooter } from '@carbon/react';
import { useReactToPrint } from 'react-to-print';
import PrintComponent from './print.component';
import styles from './print-certifications.scss';
import { type MappedEncounter } from '../types/certifications';

interface PatientDetails {
  name: string;
  age: string;
  gender: string;
  location: string;
  identifiers: string[];
  familyName?: string;
  givenName?: string;
  birthDate?: string;
  address?: string;
}

interface PrintCertificationsModalProps {
  encounters: Array<MappedEncounter>;
  patientDetails: PatientDetails;
  patient: fhir.Patient;
  closeModal: () => void;
}

const PrintCertificationsModal: React.FC<PrintCertificationsModalProps> = ({
  encounters,
  patientDetails,
  patient,
  closeModal,
}) => {
  const { t } = useTranslation();
  const contentToPrintRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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
            {encounters.map((encounter, index) => (
              <React.Fragment key={encounter.id ?? index}>
                <PrintComponent
                  subheader={
                    encounter.formName ?? encounter.encounterType ?? t('medicalCertification', 'Medical Certification')
                  }
                  patientDetails={patientDetails}
                  encounter={encounter}
                />
                <CertificationDivider currentDocumentIndex={index + 1} documentsTotal={encounters.length} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" onClick={handlePrint} disabled={isPrinting}>
          {isPrinting && <Loading withOverlay={false} small description={t('loading', 'Loading')} />}
          {isPrinting ? t('generatingPdf', 'Generating PDF...') : t('print', 'Print')}
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
