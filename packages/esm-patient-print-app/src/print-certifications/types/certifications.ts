// from esm-patient-common-lib\src\types\index.ts

import { type Diagnosis, type Obs } from '@openmrs/esm-framework';

/**
 * The form encounter as it is fetched from the API.
 */
export interface Form {
  uuid: string;
  encounterType?: EncounterType;
  name: string;
  display?: string;
  version: string;
  published: boolean;
  retired: boolean;
  resources: Array<FormEncounterResource>;
  formCategory?: string;
}

/**
 * The resource part of a form encounter.
 */
export interface FormEncounterResource {
  uuid: string;
  name: string;
  dataType: string;
  valueReference: string;
}

export interface EncounterType {
  uuid: string;
  name: string;
  viewPrivilege: Privilege | null;
  editPrivilege: Privilege | null;
}

export interface Privilege {
  uuid: string;
  name: string;
  display?: string;
  description?: string;
}

//   From esm-patient-certifications-app\src\encounters-table\encounters-table.resource.ts

export interface MappedEncounter {
  datetime: string;
  rawDatetime: string;
  diagnoses: Array<Diagnosis>;
  editPrivilege: string;
  encounterType: string;
  form: Form;
  formName: string;
  id: string;
  obs: Array<Obs>;
  provider: string;
  visitStartDatetime?: string;
  visitStopDatetime?: string;
  visitType: string;
  visitTypeUuid?: string;
  visitUuid: string;
}
