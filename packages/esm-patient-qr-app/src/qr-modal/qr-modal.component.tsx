import React, { useCallback, useState } from 'react';
import {
  Button,
  InlineLoading,
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
type ScanStatusState = 'loading' | 'not-found' | 'invalid' | 'unknown-type' | 'error';

interface ScanStatus {
  state: ScanStatusState;
  res?: string;
  message?: string;
}

const TRACKING_FNS: Record<Exclude<TrackingStyle, 'none'>, TrackFunction> = {
  outline,
  boundingBox,
  centerText,
};

const PatientQrModal: React.FC<PatientQrModalProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const devices = useDevices();

  const [paused, setPaused] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [trackingStyle, setTrackingStyle] = useState<TrackingStyle>('outline');

  const tracker = trackingStyle === 'none' ? undefined : TRACKING_FNS[trackingStyle];

  const handleScan = useCallback(
    async (codes: Array<IDetectedBarcode>) => {
      if (!codes.length || paused) return;

      setPaused(true);
      setScanStatus(null);

      const rawValue = codes[0].rawValue;

      let payload: QrPayload;
      try {
        payload = JSON.parse(rawValue) as QrPayload;
      } catch {
        setScanStatus({ state: 'invalid' });
        setPaused(false);
        return;
      }

      setScanStatus({ state: 'loading', res: payload.res });

      try {
        if (payload.res === 'patient') {
          await openmrsFetch(`/ws/rest/v1/patient/${payload.uuid}?v=ref`);
          navigate({ to: '${openmrsSpaBase}/patient/' + payload.uuid });
          closeModal();
        } else if (payload.res === 'visit') {
          const response = await openmrsFetch<{ uuid: string; patient: { uuid: string } }>(
            `/ws/rest/v1/visit/${payload.uuid}?v=custom:(uuid,patient:(uuid))`,
          );
          navigate({
            to: '${openmrsSpaBase}/patient/' + response.data.patient.uuid + '/chart/visits/' + payload.uuid,
          });
          closeModal();
        } else {
          setScanStatus({ state: 'unknown-type', res: payload.res });
          setPaused(false);
        }
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setScanStatus({ state: 'not-found', res: payload.res });
        } else {
          setScanStatus({ state: 'error', message: String((err as { message?: string })?.message ?? '') });
        }
        setPaused(false);
      }
    },
    [closeModal, paused],
  );

  const handleScannerError = useCallback(
    (err: IScannerError) => {
      setScanStatus({ state: 'error', message: err?.message ?? t('scanError', 'Failed to read QR code') });
    },
    [t],
  );

  const clearStatus = useCallback(() => {
    setScanStatus(null);
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

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '280px', flexShrink: 0 }}>
              <Scanner
                onScan={handleScan}
                onError={handleScannerError}
                paused={paused}
                constraints={selectedDeviceId ? { deviceId: selectedDeviceId } : undefined}
                tracker={tracker}
                sound={audioEnabled}
                components={{ finder: true, torch: true, zoom: true, onOff: true }}
              />
            </div>

            <div
              style={{
                flex: 1,
                minWidth: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '2rem',
              }}
            >
              {scanStatus === null && (
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  {t('scanAQrCode', 'Scan a patient or visit QR code to navigate.')}
                </p>
              )}

              {scanStatus?.state === 'loading' && (
                <InlineLoading description={t('checking', 'Checking...')} status="active" />
              )}

              {scanStatus?.state === 'not-found' && (
                <InlineNotification
                  kind="warning"
                  title={
                    scanStatus.res === 'patient'
                      ? t('patientNotFound', 'Patient not found')
                      : t('visitNotFound', 'Visit not found')
                  }
                  subtitle={t('noRecordFound', 'No record matches this QR code.')}
                  onCloseButtonClick={clearStatus}
                />
              )}

              {scanStatus?.state === 'invalid' && (
                <InlineNotification
                  kind="error"
                  title={t('invalidQrContent', 'Invalid QR code')}
                  subtitle={t('invalidQrContentDetail', 'Could not parse the scanned content.')}
                  onCloseButtonClick={clearStatus}
                />
              )}

              {scanStatus?.state === 'unknown-type' && (
                <InlineNotification
                  kind="warning"
                  title={t('unknownQrType', 'Unknown QR code type')}
                  subtitle={t('unknownQrTypeDetail', 'Expected "patient" or "visit", got "{{type}}".', {
                    type: scanStatus.res,
                  })}
                  onCloseButtonClick={clearStatus}
                />
              )}

              {scanStatus?.state === 'error' && (
                <InlineNotification
                  kind="error"
                  title={t('scanError', 'Scan error')}
                  subtitle={scanStatus.message}
                  onCloseButtonClick={clearStatus}
                />
              )}
            </div>
          </div>
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
