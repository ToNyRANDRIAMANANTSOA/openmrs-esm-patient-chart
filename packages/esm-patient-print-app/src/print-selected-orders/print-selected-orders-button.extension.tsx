import { Button } from '@carbon/react';
import { type Order, PrinterIcon, showModal } from '@openmrs/esm-framework';
import { t } from 'i18next';
import React, { useCallback, useState, type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

interface PrintSelectedOrdersButtonProps {
  selectedOrders: Order[];
  patient: fhir.Patient;
  responsiveSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const PrintSelectedOrdersButton: FunctionComponent<PrintSelectedOrdersButtonProps> = ({
  selectedOrders,
  patient,
  responsiveSize,
}) => {
  const { t } = useTranslation();
  const [isPrintingSelections, setIsPrintingSelections] = useState(false);

  const handlePrintSelected = useCallback(() => {
    const dispose = showModal('print-selected-orders-modal', {
      close: () => dispose(),
      closeModal: () => dispose(),
      selectedOrders,
      patient,
    });
  }, [patient, selectedOrders]);

  return (
    <Button
      kind="ghost"
      size={responsiveSize}
      renderIcon={PrinterIcon}
      disabled={selectedOrders.length === 0}
      onClick={() => handlePrintSelected()}
    >
      {isPrintingSelections ? t('generating', 'Generating...') : t('printSelected', 'Print selected')}
    </Button>
  );
};

export default PrintSelectedOrdersButton;
