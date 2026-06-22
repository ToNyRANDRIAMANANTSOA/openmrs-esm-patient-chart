import { age, getPatientName, openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchMultipleProviderDetails,
  reduceAttributesIntoMap,
} from '../../print-selected-orders/hooks/usePrescriptions';
import { type Certificate, type EnrichedCertEncounter, type MappedEncounter } from '../types/certifications';
import { type Provider } from '../../print-selected-orders/types/prescription';

const certEncounterRepresentation =
  'custom:(uuid,encounterDatetime,' +
  'encounterType:(uuid,display),' +
  'form:(uuid,display,name),' +
  'obs:(uuid,concept:(uuid,display),display,groupMembers:(uuid,concept:(uuid,display),value:(uuid,display),display),value,obsDatetime),' +
  'encounterProviders:(provider:(uuid,display,person:(uuid,display),attributes)),' +
  'visit:(uuid,display,startDatetime,stopDatetime,' +
  'location:(uuid,display,name,description,address1,address2,cityVillage,countyDistrict,stateProvince,country,attributes,parentLocation)))';

async function fetchMultipleCertEncounterDetails(
  encounterUuids: string[],
): Promise<Record<string, EnrichedCertEncounter>> {
  const uniqueUuids = [...new Set(encounterUuids.filter(Boolean))];

  const results = await Promise.all(
    uniqueUuids.map(async (uuid) => {
      try {
        const { data } = await openmrsFetch<EnrichedCertEncounter>(
          `${restBaseUrl}/encounter/${uuid}?v=${certEncounterRepresentation}`,
        );
        return data;
      } catch (error) {
        console.error(`Failed to fetch encounter ${uuid}:`, error);
        return null;
      }
    }),
  );

  return results.reduce(
    (acc, encounter) => {
      if (encounter) {
        if (encounter.visit?.location?.attributes) {
          encounter.visit.location.attributes = (encounter.visit.location.attributes as unknown as Array<any>).reduce(
            reduceAttributesIntoMap,
            {},
          );
        }
        acc[encounter.uuid] = encounter;
      }
      return acc;
    },
    {} as Record<string, EnrichedCertEncounter>,
  );
}

type UseCertificatesResult = {
  certificates: Array<Certificate>;
  isLoadingEncounters: boolean;
  isLoadingProviders: boolean;
  isLoading: boolean;
};

export function useCertificates({
  encounters,
  patient,
}: {
  encounters: Array<MappedEncounter>;
  patient: fhir.Patient;
}): UseCertificatesResult {
  const { t } = useTranslation();
  const { excludePatientIdentifierCodeTypes } = useConfig();

  const [enrichedEncounters, setEnrichedEncounters] = useState<Record<string, EnrichedCertEncounter>>({});
  const [isLoadingEncounters, setIsLoadingEncounters] = useState(true);

  const [enrichedProviders, setEnrichedProviders] = useState<Record<string, Provider>>({});
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Phase 1: fetch enriched encounters
  useEffect(() => {
    async function loadEncounters() {
      const encounterUuids = encounters.map((e) => e.id).filter(Boolean);
      if (encounterUuids.length === 0) {
        setIsLoadingEncounters(false);
        return;
      }
      setIsLoadingEncounters(true);
      const map = await fetchMultipleCertEncounterDetails(encounterUuids);
      setEnrichedEncounters(map);
      setIsLoadingEncounters(false);
    }
    loadEncounters();
  }, [encounters]);

  // Phase 2: fetch enriched providers once encounters are loaded
  useEffect(() => {
    async function loadProviders() {
      const providerUuids = Object.values(enrichedEncounters)
        .map((enc) => enc.encounterProviders?.[0]?.provider?.uuid)
        .filter(Boolean);

      if (providerUuids.length === 0) {
        setIsLoadingProviders(false);
        return;
      }
      setIsLoadingProviders(true);
      const map = await fetchMultipleProviderDetails(providerUuids);
      setEnrichedProviders(map);
      setIsLoadingProviders(false);
    }
    if (!isLoadingEncounters) {
      loadProviders();
    }
  }, [enrichedEncounters, isLoadingEncounters]);

  const certificates = useMemo<Array<Certificate>>(() => {
    if (!encounters?.length) {
      return [];
    }

    const getGender = (gender: string): string => t(gender, gender.charAt(0).toUpperCase() + gender.slice(1));

    const identifiers =
      patient?.identifier
        ?.filter((identifier) => !excludePatientIdentifierCodeTypes?.uuids?.includes(identifier.type.coding[0].code))
        ?.map(({ value }) => value) ?? [];

    return encounters.map((mappedEncounter) => {
      const enrichedEncounter = enrichedEncounters[mappedEncounter.id];
      const providerUuid = enrichedEncounter?.encounterProviders?.[0]?.provider?.uuid;
      const providerData = providerUuid ? enrichedProviders[providerUuid] : undefined;
      const rawProvider = enrichedEncounter?.encounterProviders?.[0]?.provider;

      return {
        id: mappedEncounter.id,

        provider: {
          uuid: rawProvider?.uuid ?? '',
          display: rawProvider?.display ?? mappedEncounter.provider,
          name: providerData?.person?.display ?? rawProvider?.person?.display,
          attributes: providerData?.attributes ?? rawProvider?.attributes,
        },

        encounter: enrichedEncounter ?? { uuid: mappedEncounter.id },

        patient: {
          uuid: patient?.id,
          display: patient ? getPatientName(patient) : '',
          age: age(patient?.birthDate),
          birthdate: patient?.birthDate,
          gender: getGender(patient?.gender ?? ''),
          address: patient?.address?.[0]?.city ?? '',
          identifiers,
          allergies: [],
        },

        obs: enrichedEncounter?.obs ?? mappedEncounter.obs,

        formName: mappedEncounter.formName,
        encounterType: mappedEncounter.encounterType,

        metadata: {
          generatedAt: new Date().toISOString(),
        },
      };
    });
  }, [encounters, enrichedEncounters, enrichedProviders, excludePatientIdentifierCodeTypes?.uuids, patient, t]);

  return {
    certificates,
    isLoadingEncounters,
    isLoadingProviders,
    isLoading: isLoadingEncounters || isLoadingProviders,
  };
}
