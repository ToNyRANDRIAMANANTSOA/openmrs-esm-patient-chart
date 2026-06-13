import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tile } from '@carbon/react';
import styles from './patient-print-app.scss';

const PatientPrintApp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Layer>
        <Tile className={styles.tile}>
          <h1 className={styles.heading}>{t('patient-print-appHeading', 'PatientPrintApp')}</h1>
          <p className={styles.content}>{t('patient-print-appDescription', 'Welcome to the PatientPrintApp page.')}</p>
        </Tile>
      </Layer>
    </div>
  );
};

export default PatientPrintApp;
