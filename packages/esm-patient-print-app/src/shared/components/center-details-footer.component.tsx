import React from 'react';
import { type Location } from '../../print-selected-orders/types/prescription';
import styles from './print-shared.scss';

type CenterDetailsFooterProps = {
  location?: Location;
};

const CenterDetailsFooter: React.FC<CenterDetailsFooterProps> = ({ location }) => {
  return (
    <div className={styles.centerDetailsFooter}>
      <p>
        <strong>{location?.attributes?.display ?? location?.name}</strong>
      </p>
      <p>{location?.attributes?.comment}</p>
    </div>
  );
};

export default CenterDetailsFooter;
