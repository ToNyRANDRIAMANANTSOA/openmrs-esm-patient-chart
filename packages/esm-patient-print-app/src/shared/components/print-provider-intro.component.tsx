import React from 'react';
import { Loading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type Provider } from '../../print-selected-orders/types/prescription';
import styles from './print-shared.scss';

type PrintProviderIntroProps = {
  provider?: Provider;
  certifyingText?: string;
  isLoadingProviders?: boolean;
};

const PrintProviderIntro: React.FC<PrintProviderIntroProps> = ({ provider, certifyingText, isLoadingProviders }) => {
  const { t } = useTranslation();

  if (isLoadingProviders) {
    return <Loading withOverlay={false} small />;
  }

  return (
    <p className={styles.providerIntro}>
      {t('iUndersigned', 'Je soussigné(e),')} <span>{provider?.attributes?.title} </span>
      <span>{provider?.name}</span>,<br />
      <span>{provider?.attributes?.specialties}</span>
      <br />
      <strong>{certifyingText ?? t('certifyHavingExamined', 'Certifie avoir examiné :')}</strong>
    </p>
  );
};

export default PrintProviderIntro;
