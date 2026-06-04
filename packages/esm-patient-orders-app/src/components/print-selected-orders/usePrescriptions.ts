import {
  age,
  fhirBaseUrl,
  getPatientName,
  openmrsFetch,
  restBaseUrl,
  useConfig,
  type Order,
} from '@openmrs/esm-framework';
import { useEffect, useMemo, useState } from 'react';
import groupBy from 'lodash-es/groupBy';
import useSWR from 'swr';
import { type Encounter, type Provider, type Prescription } from './types/prescription';
import { useTranslation } from 'react-i18next';

export const printableDrugOrderRepresentation = `
custom:(
  uuid,
  type,
  display,
  dateActivated,
  drugNonCoded,

  concept:(uuid,display),

  drug:(
    uuid,
    display,
    strength,
    dosageForm:(display)
  ),

  dose,
  doseUnits:(display),
  frequency:(display),
  route:(display),

  quantity,
  quantityUnits:(display),

  duration,
  durationUnits:(display),

  dosingInstructions,
  instructions,
  commentToFulfiller,
  urgency,

  orderReason,
  orderReasonNonCoded,

  orderType:(uuid,name),

  patient:(
    uuid,
    identifiers,
    person:(
      display,
      age,
      gender,
      birthdate,
      preferredAddress:(display)
    )
  ),

  encounter:(
    uuid,
    display,
    visit:(
      uuid,
      display,
      startDatetime
    )
  ),

  orderer:(
    uuid,
    display
  )
)
`;
const encounterRepresentation =
  'custom:(uuid,encounterDatetime,visit:(uuid,display,startDatetime,stopDatetime,location:(uuid,display,name,description,address1,address2,cityVillage,countyDistrict,stateProvince,country,attributes,parentLocation)),orders)';

async function fetchMultipleEncounterDetails(encounterUuids: string[]) {
  const uniqueUuids = [...new Set(encounterUuids.filter(Boolean))];

  const promises = uniqueUuids.map(async (uuid) => {
    try {
      const { data } = await openmrsFetch(`${restBaseUrl}/encounter/${uuid}?&v=${encounterRepresentation}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch encounter ${uuid}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);

  // Create a map of uuid -> encounter data
  return results.reduce(
    (acc, encounter) => {
      if (encounter) {
        encounter.visit.location.attributes = encounter.visit?.location?.attributes?.reduce(
          reduceAttributesIntoMap,
          {},
        );
        acc[encounter.uuid] = encounter;
      }
      return acc;
    },
    {} as Record<string, Encounter>,
  );
}

export function useEnrichedEncounters({ groupedOrders }): {
  enrichedEncounters: Record<string, Encounter>;
  isLoadingEncounters: boolean;
} {
  // State for enriched encounters
  const [enrichedEncounters, setEnrichedEncounters] = useState<Record<string, Encounter>>({});
  const [isLoadingEncounters, setIsLoadingEncounters] = useState(true);

  // Fetch all unique encounter details
  useEffect(() => {
    async function loadEncounterDetails() {
      // if (!orders?.length) {
      //   setIsLoadingEncounters(false);
      //   return;
      // }

      // Extract unique encounter UUIDs from grouped orders
      const encounterUuids = Object.values(groupedOrders)
        .map((group) => group[0]?.encounter?.uuid)
        .filter(Boolean);

      if (encounterUuids.length === 0) {
        setIsLoadingEncounters(false);
        return;
      }

      setIsLoadingEncounters(true);
      const encountersMap = await fetchMultipleEncounterDetails(encounterUuids);
      // console.log('encountersMap', encountersMap);
      setEnrichedEncounters(encountersMap);
      setIsLoadingEncounters(false);
    }

    loadEncounterDetails();
  }, [groupedOrders]);

  return {
    enrichedEncounters,
    isLoadingEncounters,
  };
}

function buildPrescriptionGroupKey(order: Order) {
  return [
    order.orderer?.uuid ?? 'unknown-provider',
    order.encounter?.uuid ?? 'unknown-encounter',
    order.type ?? order.orderType?.name ?? 'unknown-type',
  ].join('|');
}

//   const grouped = groupBy(selectedOrders, buildPrescriptionGroupKey);

type Allergy = {
  display: string;
};

export function usePatientAllergies(patientUuid: string) {
  const url = `${restBaseUrl}/patient/${patientUuid}/allergy?v=default`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Allergy> } }, Error>(
    patientUuid ? url : null,
    openmrsFetch,
  );

  return {
    allergies: data?.data?.results ?? [],
    error,
    isLoading,
  };
}

export function useProviderDetails(providerUuid: string) {
  const url = `${restBaseUrl}/provider/${providerUuid}`;

  const { data, error, isLoading } = useSWR<{ data: Provider }, Error>(providerUuid ? url : null, openmrsFetch);

  return {
    provider: data?.data,
    error,
    isLoading,
  };
}

async function fetchMultipleProviderDetails(providerUuids: string[]) {
  const uniqueUuids = [...new Set(providerUuids.filter(Boolean))];

  const promises = uniqueUuids.map(async (uuid) => {
    try {
      const { data } = await openmrsFetch(`${restBaseUrl}/provider/${uuid}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch provider ${uuid}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);

  // Create a map of uuid -> provider data
  return results.reduce(
    (acc, provider) => {
      if (provider) {
        provider.attributes = provider.attributes?.reduce(reduceAttributesIntoMap, {});
        acc[provider.uuid] = provider;
      }
      return acc;
    },
    {} as Record<string, Provider>,
  );
}

function reduceAttributesIntoMap(attributes, attribute) {
  const [key, ...value] = attribute?.display?.split(': ');
  attributes[key] = value?.join(': ');
  return attributes;
}

// // Helper to parse provider attributes into a more usable format
// function parseProviderAttributes(provider: Provider) {
//   return !provider?.attributes
//     ? []
//     : provider.attributes.map()
//     // Object.fromEntries(
//     //     Object.entries(provider.attributes).map(([key, value]) => {
//     //       console.log('[key, value]:', [key, value]);
//     //       return [key, value?.replace(new RegExp(`^(${key}:\ )`, 'i'), '')];
//     //     }),
//     //   );
// }

export function useEnrichedProviders({ groupedOrders }) {
  // State for enriched providers
  const [enrichedProviders, setEnrichedProviders] = useState<Record<string, Provider>>({});
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Fetch all unique provider details
  useEffect(() => {
    async function loadProviderDetails() {
      // if (!orders?.length) {
      //   setIsLoadingProviders(false);
      //   return;
      // }

      // Extract unique provider UUIDs from grouped orders
      const providerUuids = Object.values(groupedOrders)
        .map((group) => group[0]?.orderer?.uuid)
        .filter(Boolean);

      if (providerUuids.length === 0) {
        setIsLoadingProviders(false);
        return;
      }

      setIsLoadingProviders(true);
      const providersMap = await fetchMultipleProviderDetails(providerUuids);
      // console.log('providersMap', providersMap);
      setEnrichedProviders(providersMap);
      setIsLoadingProviders(false);
    }

    loadProviderDetails();
  }, [groupedOrders]);

  return {
    enrichedProviders,
    isLoadingProviders,
  };
}

type usePrescriptionsResult<T> = {
  prescriptions: Array<T>;
  isLoadingEncounters?: boolean;
  isLoadingProviders?: boolean;
  isLoading?: boolean;
};

export function usePrescriptions({
  orders,
  patient,
}: {
  orders: Array<Order>;
  patient: fhir.Patient;
}): usePrescriptionsResult<Prescription> {
  const { t } = useTranslation();
  const { excludePatientIdentifierCodeTypes, logo } = useConfig();
  const groupedOrders = useMemo(() => groupBy(orders, buildPrescriptionGroupKey), [orders]);
  const { enrichedProviders, isLoadingProviders } = useEnrichedProviders({ groupedOrders });
  const { enrichedEncounters, isLoadingEncounters } = useEnrichedEncounters({ groupedOrders });

  // console.log('patient', patient);
  const { allergies } = usePatientAllergies(patient?.id);
  // console.log('allergies', allergies);
  // const { provider } = useProviderDetails(groupedOrders[0].orderer?.uuid);

  const prescriptions = useMemo(() => {
    if (!orders?.length) {
      return [];
    }

    const getGender = (gender: string): string => t(gender, gender.charAt(0).toUpperCase() + gender.slice(1));

    const identifiers =
      patient?.identifier
        ?.filter((identifier) => !excludePatientIdentifierCodeTypes?.uuids?.includes(identifier.type.coding[0].code))
        ?.map(({ value }) => value) ?? [];

    // TODO: this doesn't seem the right time to normalize the orders,
    // I think it would be better when they get grouped by order type
    // And whether to import normalizeDrugOrders from the customized common-lib
    // Or to implement it here
    //   const normalizedOrders = normalizeDrugOrders(orders);
    // const normalizedOrders = orders;

    return Object.entries(groupedOrders).map(([groupKey, grouped]) => {
      const firstOrder = grouped[0];
      const providerData = enrichedProviders[firstOrder.orderer?.uuid];
      const encounter = enrichedEncounters[firstOrder.encounter?.uuid];
      const orders = encounter?.orders?.length
        ? grouped?.map((item) => encounter?.orders.find((enriched) => enriched.uuid === item.uuid) || item)
        : [];

      return {
        id: groupKey,

        provider: {
          uuid: firstOrder.orderer?.uuid,
          display: firstOrder.orderer?.display,
          name: providerData?.person?.display,
          attributes: providerData?.attributes,
        },

        encounter,

        patient: {
          uuid: patient?.id,
          display: patient ? getPatientName(patient) : '',
          age: age(patient?.birthDate),
          birthdate: patient?.birthDate,
          gender: getGender(patient?.gender),
          address: patient?.address?.[0].city,
          identifiers,
          allergies: allergies?.map((v) => v.display),
        },

        orders,

        // .map((order) => ({
        //   uuid: order.uuid,
        //   drugName: getOrderDrugName(order),
        //   dateActivated: order.dateActivated,
        //   scheduledDate: order.scheduledDate,
        //   dosage: order.dosingInstructions,
        //   instructions: order.instructions,
        //   quantity: order.quantity,
        //   quantityUnits: order.quantityUnits?.display,
        //   route: order.route?.display,
        //   frequency: order.frequency?.display,
        //   urgency: order.urgency,
        //   indication: order.orderReasonNonCoded,
        //   notes: order.commentToFulfiller,
        //   type: order.orderType.name,
        //   orderReasonNonCoded: order.orderReasonNonCoded,
        //   orderNumber: order.orderNumber,
        // })),

        facility: {
          logo,
        },

        metadata: {
          generatedAt: new Date().toISOString(),
          prescriptionType: firstOrder.orderType?.name,
        },
      };
    });
  }, [
    allergies,
    enrichedEncounters,
    enrichedProviders,
    excludePatientIdentifierCodeTypes?.uuids,
    groupedOrders,
    logo,
    orders?.length,
    patient,
    t,
  ]);

  return {
    prescriptions,
    isLoadingEncounters,
    isLoadingProviders,
    isLoading: isLoadingEncounters || isLoadingProviders,
  };
}
