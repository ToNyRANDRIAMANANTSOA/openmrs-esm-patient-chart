import React, { useCallback, type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { PrinterIcon, showModal } from '@openmrs/esm-framework';

interface PrintCertificationsButtonProps {
  selectedEncounters: Array<any>;
  patientDetails: any;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const PrintCertificationsButton: FunctionComponent<PrintCertificationsButtonProps> = ({
  selectedEncounters,
  patientDetails,
  size = 'sm',
}) => {
  const { t } = useTranslation();

  const handlePrintSelected = useCallback(() => {
    const dispose = showModal('print-certifications-modal', {
      closeModal: () => dispose(),
      encounters: selectedEncounters,
      patientDetails,
    });
  }, [selectedEncounters, patientDetails]);

  return (
    <Button
      kind="ghost"
      size={size}
      renderIcon={PrinterIcon}
      disabled={selectedEncounters.length === 0}
      onClick={handlePrintSelected}
    >
      {t('printSelected', 'Print selected')}
    </Button>
  );
};

export default PrintCertificationsButton;
