import React, { useCallback, useState } from 'react';
import {
  Button,
  InlineNotification,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Toggle,
} from '@carbon/react';
import { Pause, PlayFilledAlt } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { Scanner, useDevices, outline, boundingBox, centerText } from '@yudiel/react-qr-scanner';
import type { IDetectedBarcode, IScannerError, TrackFunction } from '@yudiel/react-qr-scanner';
import { navigate, openmrsFetch } from '@openmrs/esm-framework';

interface PatientQrModalProps {
  closeModal: () => void;
}

interface QrPayload {
  uuid: string;
  res: 'patient' | 'visit' | string;
}

type TrackingStyle = 'outline' | 'boundingBox' | 'centerText' | 'none';

const TRACKING_FNS: Record<Exclude<TrackingStyle, 'none'>, TrackFunction> = {
  outline,
  boundingBox,
  centerText,
};

const PatientQrModal: React.FC<PatientQrModalProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const devices = useDevices();

  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [trackingStyle, setTrackingStyle] = useState<TrackingStyle>('outline');

  const tracker = trackingStyle === 'none' ? undefined : TRACKING_FNS[trackingStyle];

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <Select
              id="qr-camera-select"
              labelText={t('camera', 'Camera')}
              value={selectedDeviceId ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDeviceId(e.target.value || undefined)}
              size="sm"
            >
              <SelectItem value="" text={t('defaultCamera', 'Default camera')} />
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId} text={device.label || device.deviceId} />
              ))}
            </Select>

            <Select
              id="qr-tracking-select"
              labelText={t('tracking', 'Tracking')}
              value={trackingStyle}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrackingStyle(e.target.value as TrackingStyle)}
              size="sm"
            >
              <SelectItem value="outline" text={t('trackingOutline', 'Outline')} />
              <SelectItem value="boundingBox" text={t('trackingBoundingBox', 'Bounding box')} />
              <SelectItem value="centerText" text={t('trackingCenterText', 'Center text')} />
              <SelectItem value="none" text={t('trackingNone', 'None')} />
            </Select>

            <Toggle
              id="qr-audio-toggle"
              labelText={t('audio', 'Audio')}
              toggled={audioEnabled}
              onToggle={(checked: boolean) => setAudioEnabled(checked)}
              size="sm"
            />

            <Button
              hasIconOnly
              iconDescription={paused ? t('resume', 'Resume') : t('pause', 'Pause')}
              kind="ghost"
              onClick={() => setPaused((prev) => !prev)}
              renderIcon={paused ? PlayFilledAlt : Pause}
              size="sm"
              tooltipPosition="bottom"
            />
          </div>

          <div style={{ width: '280px', alignSelf: 'center' }}>
            <Scanner
              onScan={handleScan}
              onError={handleError}
              paused={paused}
              constraints={selectedDeviceId ? { deviceId: selectedDeviceId } : undefined}
              tracker={tracker}
              sound={audioEnabled}
              components={{ finder: true, torch: true, zoom: true, onOff: true }}
            />
          </div>

          {error && (
            <InlineNotification
              kind="error"
              subtitle={error}
              title={t('scanError', 'Scan error')}
              onCloseButtonClick={dismissError}
            />
          )}
        </div>
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
