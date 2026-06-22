import type React from 'react';
import { type CertificateBodyProps } from './templates/types';
import GeneralCertificateBody from './templates/GeneralCertificateBody';
import BirthCertificateBody from './templates/BirthCertificateBody';
import DeathCertificateBody from './templates/DeathCertificateBody';
import DivingFitnessBody from './templates/DivingFitnessBody';
import FitToFlyBody from './templates/FitToFlyBody';
import GoodHealthBody from './templates/GoodHealthBody';
import NonContagionBody from './templates/NonContagionBody';
import SchoolCertificateBody from './templates/SchoolCertificateBody';
import SportsFitnessBody from './templates/SportsFitnessBody';
import { getObsByConceptKeywords } from './templates/utils';

export interface CertificateBodyConfig {
  key: string;
  title: string;
  patientFields: Array<
    'name' | 'familyName' | 'givenName' | 'age' | 'gender' | 'birthDate' | 'address' | 'location' | 'identifiers'
  >;
  practitionerFields: Array<'name' | 'onmNumber'>;
  bodyComponent: React.ComponentType<CertificateBodyProps>;
}

export const certificatesBodyRegistry: Record<string, CertificateBodyConfig> = {
  GENERAL: {
    key: 'GENERAL',
    title: 'General Certificate',
    patientFields: ['name', 'age', 'gender', 'identifiers'],
    practitionerFields: ['name'],
    bodyComponent: GeneralCertificateBody,
  },
  BIRTH: {
    key: 'BIRTH',
    title: 'Birth Certificate',
    patientFields: ['name', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    bodyComponent: BirthCertificateBody,
  },
  DEATH: {
    key: 'DEATH',
    title: 'Death Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    bodyComponent: DeathCertificateBody,
  },
  DIVING: {
    key: 'DIVING',
    title: 'Diving Fitness Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate'],
    practitionerFields: ['name', 'onmNumber'],
    bodyComponent: DivingFitnessBody,
  },
  FIT_TO_FLY: {
    key: 'FIT_TO_FLY',
    title: 'Fit To Fly Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'identifiers'],
    practitionerFields: ['name', 'onmNumber'],
    bodyComponent: FitToFlyBody,
  },
  GOOD_HEALTH: {
    key: 'GOOD_HEALTH',
    title: 'Good Health Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    bodyComponent: GoodHealthBody,
  },
  NON_CONTAGION: {
    key: 'NON_CONTAGION',
    title: 'Non-Contagion Certificate',
    patientFields: ['name', 'age', 'gender', 'address'],
    practitionerFields: ['name'],
    bodyComponent: NonContagionBody,
  },
  SCHOOL: {
    key: 'SCHOOL',
    title: 'School Attendance/Excusal Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate'],
    practitionerFields: ['name'],
    bodyComponent: SchoolCertificateBody,
  },
  SPORTS_FITNESS: {
    key: 'SPORTS_FITNESS',
    title: 'Medical Certificate of Fitness or Unfitness for Sports',
    patientFields: ['familyName', 'givenName', 'birthDate', 'address', 'location'],
    practitionerFields: ['name', 'onmNumber'],
    bodyComponent: SportsFitnessBody,
  },
};

export function getCertificateBodyConfig(subheader: string, encounter?: any): CertificateBodyConfig {
  const obsList = encounter?.obs ?? [];

  const certificateTypeFromObs = getObsByConceptKeywords(
    obsList,
    'type de certificat',
    'certificate type',
    'type certificat',
    'certificat à imprimer',
    'certificat a imprimer',
    'certificat à générer',
    'certificat a generer',
    'certification type',
    'type de certification',
    'certificat',
  );

  const textToMatch = (
    certificateTypeFromObs ||
    encounter?.form?.name ||
    encounter?.encounterType?.display ||
    subheader ||
    ''
  ).toLowerCase();

  if (textToMatch.includes('sport') || textToMatch.includes('aptitude sportive')) {
    return certificatesBodyRegistry.SPORTS_FITNESS;
  }
  if (textToMatch.includes('plong') || textToMatch.includes('diving')) {
    return certificatesBodyRegistry.DIVING;
  }
  if (textToMatch.includes('fly') || textToMatch.includes('fit to fly')) {
    return certificatesBodyRegistry.FIT_TO_FLY;
  }
  if (textToMatch.includes('birth') || textToMatch.includes('naissance')) {
    return certificatesBodyRegistry.BIRTH;
  }
  if (textToMatch.includes('death') || textToMatch.includes('décès') || textToMatch.includes('deces')) {
    return certificatesBodyRegistry.DEATH;
  }
  if (
    textToMatch.includes('good health') ||
    textToMatch.includes('bonne santé') ||
    textToMatch.includes('bonne sante')
  ) {
    return certificatesBodyRegistry.GOOD_HEALTH;
  }
  if (textToMatch.includes('contagious') || textToMatch.includes('non-contagious')) {
    return certificatesBodyRegistry.NON_CONTAGION;
  }
  if (textToMatch.includes('school') || textToMatch.includes('scolaire')) {
    return certificatesBodyRegistry.SCHOOL;
  }

  return certificatesBodyRegistry.GENERAL;
}
