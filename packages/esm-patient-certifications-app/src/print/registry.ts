import type React from 'react';
import GeneralCertificateTemplate from './templates/GeneralCertificateTemplate';
import BirthCertificateTemplate from './templates/BirthCertificateTemplate';
import DeathCertificateTemplate from './templates/DeathCertificateTemplate';
import DivingFitnessTemplate from './templates/DivingFitnessTemplate'; // Import diving template
import FitToFlyTemplate from './templates/FitToFlyTemplate';
import GoodHealthTemplate from './templates/GoodHealthTemplate';
import NonContagionTemplate from './templates/NonContagionTemplate';
import SchoolCertificateTemplate from './templates/SchoolCertificateTemplate';
import SportsFitnessTemplate from './templates/SportsFitnessTemplate'; // Import sports fitness template
import { getObsByConceptKeywords } from './templates/utils';

export interface CertificateConfig {
  key: string;
  title: string;
  patientFields: Array<
    'name' | 'familyName' | 'givenName' | 'age' | 'gender' | 'birthDate' | 'address' | 'location' | 'identifiers'
  >;
  practitionerFields: Array<'name' | 'onmNumber'>;
  showCommonHeader: boolean;
  showCommonPatientBand: boolean;
  showCommonSignatures: boolean;
  templateComponent: React.ComponentType<{
    patientDetails: any;
    encounter: any;
  }>;
}

export const certificatesRegistry: Record<string, CertificateConfig> = {
  GENERAL: {
    key: 'GENERAL',
    title: 'General Certificate',
    patientFields: ['name', 'age', 'gender', 'identifiers'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: GeneralCertificateTemplate,
  },
  BIRTH: {
    key: 'BIRTH',
    title: 'Birth Certificate',
    patientFields: ['name', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: BirthCertificateTemplate,
  },
  DEATH: {
    key: 'DEATH',
    title: 'Death Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: DeathCertificateTemplate,
  },
  DIVING: {
    key: 'DIVING',
    title: 'Diving Fitness Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate'],
    practitionerFields: ['name', 'onmNumber'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: DivingFitnessTemplate,
  },
  FIT_TO_FLY: {
    key: 'FIT_TO_FLY',
    title: 'Fit To Fly Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'identifiers'],
    practitionerFields: ['name', 'onmNumber'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: FitToFlyTemplate,
  },
  GOOD_HEALTH: {
    key: 'GOOD_HEALTH',
    title: 'Good Health Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate', 'address'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: GoodHealthTemplate,
  },
  NON_CONTAGION: {
    key: 'NON_CONTAGION',
    title: 'Non-Contagion Certificate',
    patientFields: ['name', 'age', 'gender', 'address'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: NonContagionTemplate,
  },
  SCHOOL: {
    key: 'SCHOOL',
    title: 'School Attendance/Excusal Certificate',
    patientFields: ['name', 'age', 'gender', 'birthDate'],
    practitionerFields: ['name'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: SchoolCertificateTemplate,
  },
  SPORTS_FITNESS: {
    key: 'SPORTS_FITNESS',
    title: 'Medical Certificate of Fitness or Unfitness for Sports',
    patientFields: ['familyName', 'givenName', 'birthDate', 'address', 'location'],
    practitionerFields: ['name', 'onmNumber'],
    showCommonHeader: false,
    showCommonPatientBand: false,
    showCommonSignatures: false,
    templateComponent: SportsFitnessTemplate,
  },
};

export function getCertificateConfig(subheader: string, encounter?: any): CertificateConfig {
  const obsList = encounter?.obs || [];

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
    encounter?.formName ||
    encounter?.encounterType ||
    subheader ||
    ''
  ).toLowerCase();

  if (textToMatch.includes('sport') || textToMatch.includes('aptitude sportive')) {
    return certificatesRegistry.SPORTS_FITNESS;
  }
  if (textToMatch.includes('plong') || textToMatch.includes('diving')) {
    return certificatesRegistry.DIVING;
  }
  if (textToMatch.includes('fly') || textToMatch.includes('fit to fly')) {
    return certificatesRegistry.FIT_TO_FLY;
  }
  if (textToMatch.includes('birth') || textToMatch.includes('naissance')) {
    return certificatesRegistry.BIRTH;
  }
  if (textToMatch.includes('death') || textToMatch.includes('décès') || textToMatch.includes('deces')) {
    return certificatesRegistry.DEATH;
  }
  if (
    textToMatch.includes('good health') ||
    textToMatch.includes('bonne santé') ||
    textToMatch.includes('bonne sante')
  ) {
    return certificatesRegistry.GOOD_HEALTH;
  }
  if (textToMatch.includes('contagious') || textToMatch.includes('non-contagious')) {
    return certificatesRegistry.NON_CONTAGION;
  }
  if (textToMatch.includes('school') || textToMatch.includes('scolaire')) {
    return certificatesRegistry.SCHOOL;
  }

  return certificatesRegistry.GENERAL;
}
