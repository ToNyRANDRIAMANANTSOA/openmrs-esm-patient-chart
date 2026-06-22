import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type Encounter } from '../../print-selected-orders/types/prescription';
import { formatDateUtils } from '../../print-selected-orders/utils/date-time';
import styles from './print-shared.scss';

export type PatientFieldKey =
  | 'patientId'
  | 'patientName'
  | 'familyName'
  | 'givenName'
  | 'birthDate'
  | 'age'
  | 'gender'
  | 'allergies'
  | 'address'
  | 'location'
  | 'passportNumber';

type PatientInfo = {
  uuid?: string;
  identifiers?: string[];
  display: string;
  familyName?: string;
  givenName?: string;
  age?: string | number;
  birthdate?: string;
  gender?: string;
  allergies?: any[];
  address?: string;
  location?: string;
  passportNumber?: string;
};

type QrCodeSlotConfig = {
  valueType: string;
  bottomTextSource: string;
  bottomTextCustomValue: string;
};

export type QrLayoutConfig = {
  leftQrCode?: QrCodeSlotConfig;
  rightQrCode?: QrCodeSlotConfig;
};

type PrintPatientDetailsProps = {
  patient: PatientInfo;
  encounter?: Encounter;
  fields: PatientFieldKey[];
  config?: QrLayoutConfig;
  isLoadingEncounters?: boolean;
  useLargerFontSize?: boolean;
  showBorders?: boolean;
  borderPadding?: number;
};

const PrintPatientDetails: React.FC<PrintPatientDetailsProps> = ({
  patient,
  encounter,
  fields,
  config,
  isLoadingEncounters,
  useLargerFontSize = false,
  showBorders = false,
  borderPadding = 12,
}) => {
  const { t } = useTranslation();

  const has = (key: PatientFieldKey) => fields.includes(key);

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

  const showDobAgeGenderRow = has('birthDate') || has('age') || has('gender');

  return (
    <div
      className={styles.patientInfo}
      style={{
        border: showBorders ? '1px solid #ccc' : 'none',
        padding: showBorders ? `${borderPadding}px` : '0',
        fontSize: useLargerFontSize ? '1.1em' : 'inherit',
      }}
    >
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
            {has('patientId') && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('patientId', 'Patient ID:')}</strong> <span>{patient?.identifiers?.[0]}</span>
                </td>
              </tr>
            )}

            {has('patientName') && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('patientName', 'Patient Name:')}</strong> <span>{patient?.display}</span>
                </td>
              </tr>
            )}

            {has('familyName') && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('familyName', 'Family Name:')}</strong> <span>{patient?.familyName}</span>
                </td>
              </tr>
            )}

            {has('givenName') && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('givenName', 'Given Name:')}</strong> <span>{patient?.givenName}</span>
                </td>
              </tr>
            )}

            {showDobAgeGenderRow && (
              <tr>
                {has('birthDate') && (
                  <td>
                    <strong>{t('dob', 'Date of birth:')}</strong> {formatDateUtils(patient?.birthdate)}
                  </td>
                )}
                {has('age') && (
                  <td>
                    <strong>{t('age', 'Age:')}</strong> {patient?.age}
                  </td>
                )}
                {has('gender') && (
                  <td>
                    <strong>{t('gender', 'Gender:')}</strong> {patient?.gender}
                  </td>
                )}
              </tr>
            )}

            {has('allergies') && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('allergies', 'Allergies:')}</strong>{' '}
                  {patient?.allergies?.length
                    ? patient.allergies.join(', ')
                    : t('noAllergiesRecorded', 'No allergies recorded')}
                </td>
              </tr>
            )}

            {has('address') && patient?.address && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('address', 'Address:')}</strong> <span>{patient.address}</span>
                </td>
              </tr>
            )}

            {has('location') && encounter?.visit?.location?.display && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('location', 'Location:')}</strong> <span>{encounter.visit.location.display}</span>
                </td>
              </tr>
            )}

            {has('passportNumber') && patient?.passportNumber && (
              <tr>
                <td colSpan={3}>
                  <strong>{t('passportNumber', 'Passport No:')}</strong> <span>{patient.passportNumber}</span>
                </td>
              </tr>
            )}
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
