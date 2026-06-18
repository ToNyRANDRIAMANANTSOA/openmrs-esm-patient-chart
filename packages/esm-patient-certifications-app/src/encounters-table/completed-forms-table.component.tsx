import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import { userHasAccess, useSession, type EncounterType } from '@openmrs/esm-framework';
import { invalidateVisitAndEncounterData } from '@openmrs/esm-patient-common-lib';
import { type EncountersTableProps, useAllEncounters, encounterHasJsonSchemaForm } from './encounters-table.resource';
import EncountersTable from './encounters-table.component';

interface CompletedFormsTableProps {
  patientUuid: string;
  isTabActive?: boolean;
}

const CompletedFormsTable: React.FC<CompletedFormsTableProps> = ({ patientUuid, isTabActive = false }) => {
  const [encounterTypeToFilter, setEncounterTypeToFilterState] = useState<EncounterType>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (isTabActive) {
      invalidateVisitAndEncounterData(mutate, patientUuid);
    }
  }, [isTabActive, mutate, patientUuid]);

  const setEncounterTypeToFilter = useCallback((encounterType: EncounterType) => {
    setEncounterTypeToFilterState(encounterType);
    setCurrentPage(1);
  }, []);

  const { data: allEncounters, isLoading } = useAllEncounters(
    isTabActive ? patientUuid : null,
    encounterTypeToFilter?.uuid,
  );

  const filteredCompletedForms = useMemo(() => {
    if (!allEncounters) {
      return [];
    }
    return allEncounters.filter(encounterHasJsonSchemaForm);
  }, [allEncounters]);

  const paginatedEncounters = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCompletedForms.slice(startIndex, endIndex);
  }, [filteredCompletedForms, currentPage, pageSize]);

  const goTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const session = useSession();
  const canPrintEncounters = userHasAccess('App: Print encounter forms', session?.user);

  const encountersTableProps: EncountersTableProps = {
    currentPage,
    encounterTypeToFilter,
    goTo,
    isLoading,
    pageSize,
    paginatedEncounters: paginatedEncounters,
    patientUuid,
    setEncounterTypeToFilter,
    setPageSize,
    showEncounterTypeFilter: true,
    showVisitType: true,
    totalCount: filteredCompletedForms.length,
    isSelectable: true,
    canPrintEncounters,
  };

  return <EncountersTable {...encountersTableProps} />;
};

export default CompletedFormsTable;
