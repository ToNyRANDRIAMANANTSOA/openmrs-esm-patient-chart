import React, { useCallback, useState } from 'react';
import { Button, InlineNotification, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Scanner } from '@yudiel/react-qr-scanner';
import type { IDetectedBarcode, IScannerError } from '@yudiel/react-qr-scanner';
import { navigate, openmrsFetch } from '@openmrs/esm-framework';

interface PatientQrModalProps {
  closeModal: () => void;
}

interface QrPayload {
  uuid: string;
  res: 'patient' | 'visit' | string;
}

const PatientQrModal: React.FC<PatientQrModalProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (codes: Array<IDetectedBarcode>) => {
      if (!codes.length || paused) return;

      setPaused(true);
      setError(null);

      const rawValue = codes[0].rawValue;

      try {
        const payload = JSON.parse(rawValue) as QrPayload;

        if (payload.res === 'patient') {
          navigate({ to: '${openmrsSpaBase}/patient/' + payload.uuid + '/chart' });
          closeModal();
        } else if (payload.res === 'visit') {
          const response = await openmrsFetch<{ patient: { uuid: string } }>(
            `/ws/rest/v1/visit/${payload.uuid}?v=custom:(patient:(uuid))`,
          );
          navigate({ to: '${openmrsSpaBase}/patient/' + response.data.patient.uuid + '/chart' });
          closeModal();
        } else {
          setError(t('unknownQrType', 'Unknown QR code type: {{type}}', { type: payload.res }));
          setPaused(false);
        }
      } catch {
        setError(t('invalidQrContent', 'Invalid QR code content'));
        setPaused(false);
      }
    },
    [closeModal, paused, t],
  );

  const handleError = useCallback(
    (err: IScannerError) => {
      setError(err?.message ?? t('scanError', 'Failed to read QR code'));
    },
    [t],
  );

  const dismissError = useCallback(() => {
    setError(null);
    setPaused(false);
  }, []);

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('scanQrCode', 'Scan QR code')} />
      <ModalBody>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          paused={paused}
          components={{ finder: true }}
          sound={false}
          styles={{ container: { width: '280px', margin: '0 auto' } }}
        />
        {error && (
          <InlineNotification
            kind="error"
            subtitle={error}
            title={t('scanError', 'Scan error')}
            onCloseButtonClick={dismissError}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('close', 'Close')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default PatientQrModal;
