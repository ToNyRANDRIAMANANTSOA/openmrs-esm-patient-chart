import React, { useCallback, type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { PrinterIcon, showModal } from '@openmrs/esm-framework';
import { type MappedEncounter } from './types/certifications';

interface PrintCertificationsButtonProps {
  selectedEncounters: Array<MappedEncounter>;
  patient: fhir.Patient;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const PrintCertificationsButton: FunctionComponent<PrintCertificationsButtonProps> = ({
  selectedEncounters,
  patient,
  size = 'sm',
}) => {
  const { t } = useTranslation();

  const handlePrintSelected = useCallback(() => {
    const dispose = showModal('print-certifications-modal', {
      closeModal: () => dispose(),
      encounters: selectedEncounters,
      patient,
    });
  }, [selectedEncounters, patient]);

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
