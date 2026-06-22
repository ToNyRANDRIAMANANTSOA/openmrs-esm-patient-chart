import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Location } from '../../print-selected-orders/types/prescription';

type PrintSignatureBlockProps = {
  location?: Location;
  encounterDate?: string;
};

const PrintSignatureBlock: React.FC<PrintSignatureBlockProps> = ({ location, encounterDate }) => {
  const { t } = useTranslation();
  let locationName = location?.countyDistrict;
  locationName += location?.stateProvince ? ', ' + location?.stateProvince : '';
  locationName += location?.country ? ', ' + location?.country : '';
  locationName ??= location?.display ?? location?.name ?? '';

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
      <div style={{ fontWeight: 'bold', lineHeight: 2.2, textAlign: 'right', fontSize: '1.1em' }}>
        <div>
          {t('doneAt', 'Done at')} {locationName}
        </div>
        <div>
          {t('onDate', 'on')} {encounterDate}
        </div>
        <div>{t('signatureAndStamp', "Doctor's Signature and Stamp")}</div>
      </div>
    </div>
  );
};

export default PrintSignatureBlock;
