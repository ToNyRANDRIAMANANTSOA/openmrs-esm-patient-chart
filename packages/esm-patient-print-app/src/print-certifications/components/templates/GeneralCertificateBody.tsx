import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../../../print-selected-orders/components/printable-prescription.scss';
import { type CertificateBodyProps } from './types';
import { flattenObs, getObsValue, getObsByConceptKeywords, calcDurationDays, formatDateLong } from './utils';

const GeneralCertificateBody: React.FC<CertificateBodyProps> = ({ certificate, isLoadingEncounters }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';
  const rows = flattenObs(certificate.obs).filter((obs) => getObsValue(obs));

  // Extract medical leave details
  const restEndMethod = getObsByConceptKeywords(certificate.obs, 'rest end method', 'méthode de fin');
  const sickLeaveStartDate = getObsByConceptKeywords(
    certificate.obs,
    'sick leave start date',
    "date de début d'arrêt",
    'date de début',
  );
  const sickLeaveEndDate = getObsByConceptKeywords(
    certificate.obs,
    'sick leave end date',
    "date de fin d'arrêt",
    'date de fin',
  );
  const numDaysOfSickLeave = getObsByConceptKeywords(
    certificate.obs,
    'number of days of sick leave',
    "nombre de jours d'arrêt",
  );

  // Calculate duration and end date
  // Priority 1: Use "Number of days of sick leave" as duration and calculate end date
  // Priority 2: If "Rest end method" is "Per date", use provided end date and calculate duration
  let duration: number | null = null;
  let endDate = '';

  if (numDaysOfSickLeave) {
    // Default: use days and calculate end date
    duration = parseInt(numDaysOfSickLeave, 10);
    if (sickLeaveStartDate && duration > 0) {
      // Calculate end date: start + (duration - 1) days (inclusive)
      const startDateObj = new Date(sickLeaveStartDate.split('T')[0].split('-').join('-'));
      if (!isNaN(startDateObj.getTime())) {
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(endDateObj.getDate() + duration - 1);
        const yyyy = endDateObj.getFullYear();
        const mm = String(endDateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(endDateObj.getDate()).padStart(2, '0');
        endDate = `${yyyy}-${mm}-${dd}`;
      }
    }
  } else if (restEndMethod?.toLowerCase().includes('date') || restEndMethod?.toLowerCase().includes('per')) {
    // Fallback: if "Rest end method" is "Per date", calculate from dates
    if (sickLeaveStartDate && sickLeaveEndDate) {
      endDate = sickLeaveEndDate;
      duration = calcDurationDays(sickLeaveStartDate, sickLeaveEndDate);
    }
  }

  // Format dates for display
  const formattedStartDate = sickLeaveStartDate ? formatDateLong(sickLeaveStartDate, locale) : '';
  const formattedEndDate = endDate ? formatDateLong(endDate, locale) : '';
  const hasMedicalLeave = sickLeaveStartDate && (duration || formattedEndDate) !== null;

  return (
    <section className={styles.block}>
      {isLoadingEncounters ? (
        <Loading withOverlay={false} small />
      ) : (
        <>
          {hasMedicalLeave && (
            <p className={styles.bodyLong01}>
              {t('certBody.general.healthNecessitates', 'Certifies that his/her current state of health necessitates:')}
            </p>
          )}
          {hasMedicalLeave && (
            <p className={styles.bodyLong01} style={{ marginTop: '12px' }}>
              {t('certBody.general.medicalLeavePrefix', 'A medical leave of')}{' '}
              <strong>
                {duration} {t('certBody.dayUnit', 'day(s)')}
              </strong>
              , {t('certBody.general.medicalLeaveRange', 'from')} <strong>{formattedStartDate}</strong>{' '}
              {t('certBody.general.medicalLeaveTo', 'to')} <strong>{formattedEndDate}</strong>{' '}
              {t('certBody.general.medicalLeaveInclusive', 'inclusive')}.
            </p>
          )}
          {/* {rows.length > 0 && (
            <>
              <p className={styles.bodyLong01} style={{ marginTop: hasMedicalLeave ? '12px' : '0' }}>
                {t('certBody.general.followingElements', 'The following medical elements:')}
              </p>
              <dl style={{ marginTop: '12px' }}>
                {rows.map((obs, index) => (
                  <div key={obs.uuid ?? index} style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <dt style={{ fontWeight: 600, display: 'inline' }}>{obs.concept?.display}: </dt>
                    <dd style={{ display: 'inline', margin: 0 }}>{getObsValue(obs)}</dd>
                  </div>
                ))}
              </dl>
            </>
          )} */}
          {!hasMedicalLeave && rows.length === 0 && (
            <p className={styles.bodyLong01}>{t('noDataRecorded', 'No data recorded')}</p>
          )}
        </>
      )}
    </section>
  );
};

export default GeneralCertificateBody;
