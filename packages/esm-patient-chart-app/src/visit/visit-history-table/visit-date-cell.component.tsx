import { ConfigurableLink, formatDate, type Visit } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { spaBasePath } from '../../constants';

interface Props {
  visit: Visit;
  patient: fhir.Patient;
}

const VisitDateCell: React.FC<Props> = ({ visit }) => {
  const { t } = useTranslation();
  const { startDatetime, stopDatetime } = visit;
  const fromDate = formatDate(new Date(startDatetime));
  const toDate = stopDatetime ? formatDate(new Date(stopDatetime)) : null;
  const label = toDate ? t('fromDateToDate', '{{fromDate}} - {{toDate}}', { fromDate, toDate }) : fromDate;
  const visitDetailUrl = `${spaBasePath.replace(':patientUuid', visit.patient.uuid)}/visits/${visit.uuid}`;

  return <ConfigurableLink to={visitDetailUrl}>{label}</ConfigurableLink>;
};

export default VisitDateCell;
