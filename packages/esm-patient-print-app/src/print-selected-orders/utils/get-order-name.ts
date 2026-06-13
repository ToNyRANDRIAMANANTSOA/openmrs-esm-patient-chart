import { type Order } from '@openmrs/esm-framework';

export function getOrderDrugName(order: Order) {
  return order.drugNonCoded ?? order.drug?.display ?? order.concept?.display ?? order.display;
}

export function getOrderTestName(order: Order) {
  return order.testNonCoded ?? order.test?.display ?? order.concept?.display ?? order.display;
}
