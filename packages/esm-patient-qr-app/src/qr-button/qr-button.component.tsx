import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { QrCode } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';

const QrButton: React.FC = () => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    const dispose = showModal('patient-qr-modal', {
      closeModal: () => dispose(),
    });
  }, []);

  return (
    <Button
      hasIconOnly
      iconDescription={t('scanQrCode', 'Scan QR code')}
      kind="ghost"
      onClick={handleClick}
      renderIcon={() => <QrCode color="white" />}
      size="lg"
      tooltipAlignment="end"
      tooltipPosition="bottom"
    />
  );
};

export default QrButton;
