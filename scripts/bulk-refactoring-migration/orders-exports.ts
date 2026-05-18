// scripts/orders-exports.ts

// AUTOMATED ?? ⚠️

// import fs from 'node:fs';
// import path from 'node:path';

// const exportsFilePath = path.resolve(process.cwd(), 'orders-exports.txt');

// const migratedExports = new Set(
//   fs
//     .readFileSync(exportsFilePath, 'utf-8')
//     .split(/\r?\n/)
//     .map((line) => line.trim())
//     .filter(Boolean),
// );

// export { migratedExports };

// MANUALLY BULK EDITED FROM THE LIST IN orders-exports.txt
// TODO: Maybe separate ts types from other exports?

export const migratedExports = new Set([
  'Concept',
  'Drug',
  'OrderAction',
  'ExtractedOrderErrorObject',
  'OrderErrorObject',
  'OrderBasketItem',
  'OrderUrgency',
  'PriorityOption',
  'OrderPost',
  'DrugOrderPost',
  'TestOrderPost',
  'PatientOrderFetchResponse',
  'Order',
  'OrderTypeFetchResponse',
  'OrderType',
  'FulfillerStatus',
  'PostDataPrepFunction',
  'OrderBasketExtensionProps',
  'DrugOrderBasketItem',
  'DrugOrderTemplate',
  'OrderTemplate',
  'DosingInstructions',
  'MedicationDosage',
  'MedicationFrequency',
  'MedicationRoute',
  'MedicationInstructions',
  'DosingUnit',
  'QuantityUnit',
  'DurationUnit',
  'CommonMedicationValueCoded',
  'TestOrderBasketItem',
  'OrderBasketWindowProps',
  'ExportedOrderBasketWindowProps',
  'OrderTypeJavaClassName',
  'OrderTypeResponse',
  'useOrderTypes',
  'OrderBasketStore',
  'orderBasketStore',
  '_resetOrderBasketStore',
  'showOrderSuccessToast',
  'useMutatePatientOrders',
  'Status',
  'careSettingUuid',
  'drugCustomRepresentation',
  'orderCustomRepresentation',
  'normalizeDrugOrder',
  'normalizeDrugOrders',
  'usePatientOrders',
  'getDrugOrderByUuid',
  'useDrugOrderByUuid',
  'priorityOptions',
  'postOrdersOnNewEncounter',
  'EncounterPost',
  'postEncounter',
  'postOrders',
  'postOrder',
  'OrderableConcept',
  'useOrderableConceptSets',
  'ClearOrdersOptions',
  'useOrderBasket',
  'useOrderType',
]);
