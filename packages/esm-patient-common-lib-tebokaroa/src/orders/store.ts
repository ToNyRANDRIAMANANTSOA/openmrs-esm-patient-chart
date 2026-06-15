import { getGlobalStore } from '@openmrs/esm-framework';
import type { OrderBasketItem, PostDataPrepFunction } from './types';

// The order basket holds order information for each patient. The orders are grouped by `key`
// so that different parts of the application may manage their own order lists. For example,
// the medication order list might be grouped as `medications`, and might be managed by the
// medication order basket panel.
export interface OrderBasketStore {
  items: {
    [patientUuid: string]: {
      [grouping: string]: Array<OrderBasketItem>;
    };
  };
  postDataPrepFunctions: {
    [grouping: string]: PostDataPrepFunction;
  };
}

const initialState = {
  items: {},
  postDataPrepFunctions: {},
};

// Reuse the single global `order-basket` store (created by @openmrs/esm-patient-common-lib).
// `getGlobalStore` is idempotent: it returns the existing store or creates it if absent,
// so this subset shares one basket instance with the rest of the chart instead of
// registering a second store under the same name.
export const orderBasketStore = getGlobalStore<OrderBasketStore>('order-basket', initialState);

/**
 * @internal for testing only
 */
export function _resetOrderBasketStore() {
  orderBasketStore.setState(initialState);
}
