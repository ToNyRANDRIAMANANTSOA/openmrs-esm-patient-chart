import { type OrderUrgency, type OpenmrsResource, type Order } from '@openmrs/esm-framework';

export type PatientItendifier = {
  display: string;
  uuid?: string;
  type?: string; // e.g. "OpenMRS ID", etc.
};

export type Prescription = {
  id: string;

  provider: Provider;

  encounter: Encounter;

  patient: {
    uuid: string;
    identifiers?: Array<string>;
    display: string;
    age?: string | number;
    birthdate?: string;
    gender?: string;
    address?: string;
    weightKg?: number;
    allergies?: Array<any>;
  };

  orders: Order[];

  facility?: {
    logo?: {
      src: string;
      alt?: string;
      name?: string;
    };
  };

  metadata: {
    generatedAt: string;
    prescriptionType: string;
  };
};

export type PrintableDrugOrder = {
  uuid: string;
  drugName?: string;
  dateActivated?: string;
  scheduledDate?: string;
  dosage?: string | null;
  instructions?: string | null;
  quantity: number;
  quantityUnits?: string;
  route?: string;
  frequency?: string;
  urgency: OrderUrgency;
  indication?: string | null;
  notes?: string;
  type?: string;
  orderReasonNonCoded?: string;
  orderNumber: string;
};

export interface Provider {
  uuid: string;
  display: string;
  comments?: string;
  response?: string;
  person?: OpenmrsResource;
  name?: string;
  attributes?: {
    specialties?: string;
    title?: string;
    licenseNb?: string;
    licenseType?: string;
    phoneNumber?: string;
    email?: string;
  };
}

// Location type
export interface Location {
  uuid: string;
  display?: string;
  name?: string;
  description?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  countyDistrict?: string;
  stateProvince?: string;
  country?: string;
  attributes?: {
    addressDisplay?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    logo?: string;
    logoBW?: string;
  };
  parentLocation?: Location;
}

// Visit type
export interface Visit {
  uuid: string;
  location?: Location;
  display?: string;
  startDatetime?: string;
  stopDatetime?: string;
  visitType?: {
    uuid: string;
    display: string;
  };
  encounters?: Encounter[];
}

// Main Encounter type
export interface Encounter {
  uuid: string;
  encounterDatetime?: string;
  display?: string;
  visit?: Visit;
  orders?: Array<Order>;
}
