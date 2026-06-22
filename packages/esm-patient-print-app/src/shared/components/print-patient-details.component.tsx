import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type Encounter } from '../../print-selected-orders/types/prescription';
import { formatDateUtils } from '../../print-selected-orders/utils/date-time';
import styles from './print-shared.scss';

type PatientInfo = {
  uuid?: string;
  identifiers?: string[];
  display: string;
  age?: string | number;
  birthdate?: string;
  gender?: string;
  allergies?: any[];
};

type QrCodeSlotConfig = {
  valueType: string;
  bottomTextSource: string;
  bottomTextCustomValue: string;
};

export type QrLayoutConfig = {
  showIdentifierRow?: boolean;
  leftQrCode?: QrCodeSlotConfig;
  rightQrCode?: QrCodeSlotConfig;
};

type PrintPatientDetailsProps = {
  patient: PatientInfo;
  encounter?: Encounter;
  config?: QrLayoutConfig;
  isLoadingEncounters?: boolean;
};

const PrintPatientDetails: React.FC<PrintPatientDetailsProps> = ({
  patient,
  encounter,
  config,
  isLoadingEncounters,
}) => {
  const { t } = useTranslation();

  const getQrValue = (valueType: string): string | null => {
    switch (valueType) {
      case 'patient_uuid':
        return `{"uuid":"${patient?.uuid}","res":"patient"}`;
      case 'visit_uuid':
        return `{"uuid":"${encounter?.visit?.uuid}","res":"visit"}`;
      default:
        return null;
    }
  };

  const getQrBottomText = (source: string, customValue: string): React.ReactNode | null => {
    switch (source) {
      case 'patient_identifier':
        return <code>{patient?.identifiers?.[0]}</code>;
      case 'visit_label':
        return <strong>{t('visitDetails', 'Visit Details')}</strong>;
      case 'custom':
        return customValue || null;
      default:
        return null;
    }
  };

  const leftQrValue = config?.leftQrCode ? getQrValue(config.leftQrCode.valueType) : null;
  const leftQrBottomText = config?.leftQrCode
    ? getQrBottomText(config.leftQrCode.bottomTextSource, config.leftQrCode.bottomTextCustomValue)
    : null;
  const rightQrValue = config?.rightQrCode ? getQrValue(config.rightQrCode.valueType) : null;
  const rightQrBottomText = config?.rightQrCode
    ? getQrBottomText(config.rightQrCode.bottomTextSource, config.rightQrCode.bottomTextCustomValue)
    : null;

  return (
    <div className={styles.patientInfo}>
      <div className={styles.patientInfoRow}>
        {(leftQrValue || leftQrBottomText) && (
          <div className={styles.qrBlock}>
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small />
            ) : (
              <>
                {leftQrValue && <QRCodeSVG value={leftQrValue} size={96} />}
                {leftQrBottomText && (
                  <>
                    <br />
                    {leftQrBottomText}
                  </>
                )}
              </>
            )}
          </div>
        )}

        <table>
          <tbody>
            {config?.showIdentifierRow && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('patientId', 'Patient ID:')}</strong> <span>{patient?.identifiers?.[0]}</span>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan={3}>
                <strong>{t('patientName', 'Patient Name:')}</strong> <span>{patient?.display}</span>
              </td>
            </tr>

            <tr>
              <td>
                <strong>{t('dob', 'Date of birth:')}</strong> {formatDateUtils(patient?.birthdate)}
              </td>
              <td>
                <strong>{t('age', 'Age:')}</strong> {patient?.age}
              </td>
              <td>
                <strong>{t('gender', 'Gender:')}</strong> {patient?.gender}
              </td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>{t('allergies', 'Allergies:')}</strong>{' '}
                {patient?.allergies?.length
                  ? patient.allergies.join(', ')
                  : t('noAllergiesRecorded', 'No allergies recorded')}
              </td>
            </tr>
          </tbody>
        </table>

        {(rightQrValue || rightQrBottomText) && (
          <div className={styles.qrBlock}>
            {isLoadingEncounters ? (
              <Loading withOverlay={false} small />
            ) : (
              <>
                {rightQrValue && <QRCodeSVG value={rightQrValue} size={96} />}
                {rightQrBottomText && (
                  <>
                    <br />
                    {rightQrBottomText}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintPatientDetails;
