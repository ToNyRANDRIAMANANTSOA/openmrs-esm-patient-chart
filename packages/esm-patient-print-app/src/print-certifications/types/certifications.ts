// from esm-patient-common-lib\src\types\index.ts

import { type Diagnosis, type Obs } from '@openmrs/esm-framework';
import { type Encounter, type Provider, type Visit } from '../../print-selected-orders/types/prescription';

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

export interface EnrichedCertEncounter extends Encounter {
  encounterType?: { uuid: string; display: string };
  form?: { uuid: string; display: string; name: string };
  obs?: Array<Obs>;
  encounterProviders?: Array<{
    provider: {
      uuid: string;
      display: string;
      person?: { uuid: string; display: string };
      attributes?: Record<string, string>;
    };
  }>;
}

export type Certificate = {
  id: string;
  provider: Provider;
  encounter: EnrichedCertEncounter;
  patient: {
    uuid: string;
    display: string;
    age: string | number;
    birthdate: string;
    gender: string;
    address: string;
    identifiers: string[];
    allergies: string[];
  };
  obs: Array<Obs>;
  formName: string;
  encounterType: string;
  metadata: {
    generatedAt: string;
  };
};

export type { Encounter, Provider, Visit };
