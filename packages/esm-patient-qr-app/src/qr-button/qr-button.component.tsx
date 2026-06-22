import React, { useCallback } from 'react';
import { HeaderGlobalAction } from '@carbon/react';
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
    <HeaderGlobalAction aria-label={t('scanQrCode', 'Scan QR code')} onClick={handleClick}>
      <QrCode size={20} />
    </HeaderGlobalAction>
  );
};

export default QrButton;
