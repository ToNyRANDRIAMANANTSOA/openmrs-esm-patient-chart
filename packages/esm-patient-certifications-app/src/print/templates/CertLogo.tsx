import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import styles from './templates.scss';

const mediaikoLogoUrl = new URL('../../../public/Mediaiko-colored-logo.webp', import.meta.url).href;

export const CertLogo: React.FC = () => {
  const { logo } = useConfig();
  if (logo?.src) {
    return <img className={styles.certLogo} src={logo.src} alt={logo.alt ?? 'Clinic Logo'} />;
  }
  if (logo?.name) {
    return <span className={styles.certLogoName}>{logo.name}</span>;
  }
  return <img className={styles.certLogo} src={mediaikoLogoUrl} alt="Mediaiko" />;
};
