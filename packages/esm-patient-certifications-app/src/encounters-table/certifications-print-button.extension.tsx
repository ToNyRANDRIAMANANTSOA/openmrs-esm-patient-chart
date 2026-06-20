import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { PrinterIcon } from '@openmrs/esm-framework';

interface Props {
  onPrint?: () => void;
  isPrinting?: boolean;
  disabled?: boolean;
  size?: string;
}

const CertificationsPrintButton: React.FC<Props> = ({ onPrint, isPrinting = false, disabled = false, size = 'sm' }) => {
  const { t } = useTranslation();
  return (
    <Button kind="ghost" size={size as any} renderIcon={PrinterIcon} disabled={disabled} onClick={onPrint}>
      {isPrinting ? t('generating', 'Generating...') : t('printSelected', 'Print selected')}
    </Button>
  );
};

export default CertificationsPrintButton;
