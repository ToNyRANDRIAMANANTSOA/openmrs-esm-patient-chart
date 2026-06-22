import type React from 'react';
import { type PatientFieldKey } from '../../shared/components/print-patient-details.component';
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
  titleKey: string;
  subtitleKey?: string;
  patientFields: Array<PatientFieldKey>;
  practitionerFields: Array<'name' | 'onmNumber'>;
  bodyComponent: React.ComponentType<CertificateBodyProps>;
}

export const certificatesBodyRegistry: Record<string, CertificateBodyConfig> = {
  GENERAL: {
    key: 'GENERAL',
    title: 'Medical Certificate',
    titleKey: 'generalCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: GeneralCertificateBody,
  },
  BIRTH: {
    key: 'BIRTH',
    title: 'Birth Certificate',
    titleKey: 'birthCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: BirthCertificateBody,
  },
  DEATH: {
    key: 'DEATH',
    title: 'Death Certificate',
    titleKey: 'deathCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: DeathCertificateBody,
  },
  DIVING: {
    key: 'DIVING',
    title: 'Diving Fitness Certificate',
    titleKey: 'divingCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name', 'onmNumber'],
    bodyComponent: DivingFitnessBody,
  },
  FIT_TO_FLY: {
    key: 'FIT_TO_FLY',
    title: 'Certificate of Fitness to Fly',
    titleKey: 'fitToFlyCertTitle',
    subtitleKey: 'fitToFlyCertSubtitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId', 'passportNumber'],
    practitionerFields: ['name', 'onmNumber'],
    bodyComponent: FitToFlyBody,
  },
  GOOD_HEALTH: {
    key: 'GOOD_HEALTH',
    title: 'Good Health Certificate',
    titleKey: 'goodHealthCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: GoodHealthBody,
  },
  NON_CONTAGION: {
    key: 'NON_CONTAGION',
    title: 'Non-Contagion Certificate',
    titleKey: 'nonContagionCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: NonContagionBody,
  },
  SCHOOL: {
    key: 'SCHOOL',
    title: 'School Medical Certificate',
    titleKey: 'schoolCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
    practitionerFields: ['name'],
    bodyComponent: SchoolCertificateBody,
  },
  SPORTS_FITNESS: {
    key: 'SPORTS_FITNESS',
    title: 'Medical Certificate of Fitness for Sports',
    titleKey: 'sportsCertTitle',
    patientFields: ['patientName', 'birthDate', 'age', 'gender', 'patientId'],
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
