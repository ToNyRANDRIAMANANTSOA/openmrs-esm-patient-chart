import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import { invalidateVisitAndEncounterData } from '@openmrs/esm-patient-common-lib';
import { type EncountersTableProps, useAllEncounters, encounterHasJsonSchemaForm } from './encounters-table.resource';
import EncountersTable from './encounters-table.component';

interface CompletedFormsTableProps {
  patientUuid: string;
  isTabActive?: boolean;
  canPrintEncounters?: boolean;
  onPrintStateChange?: (state: { onPrint: () => void; disabled: boolean; isPrinting: boolean } | null) => void;
}

const CompletedFormsTable: React.FC<CompletedFormsTableProps> = ({
  patientUuid,
  isTabActive = false,
  canPrintEncounters = false,
  onPrintStateChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formNameToFilter, setFormNameToFilterState] = useState<string | null>(null);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (isTabActive) {
      invalidateVisitAndEncounterData(mutate, patientUuid);
    }
  }, [isTabActive, mutate, patientUuid]);

  const setFormNameToFilter = useCallback((name: string | null) => {
    setFormNameToFilterState(name);
    setCurrentPage(1);
  }, []);

  const { data: allEncounters, isLoading } = useAllEncounters(isTabActive ? patientUuid : null);

  const filteredCompletedForms = useMemo(() => {
    if (!allEncounters) return [];
    return allEncounters
      .filter(encounterHasJsonSchemaForm)
      .filter((enc) => !formNameToFilter || enc.form?.display === formNameToFilter);
  }, [allEncounters, formNameToFilter]);

  const availableFormNames = useMemo(() => {
    if (!allEncounters) return [];
    const names = new Set<string>();
    allEncounters.filter(encounterHasJsonSchemaForm).forEach((enc) => {
      if (enc.form?.display) names.add(enc.form.display);
    });
    return Array.from(names).sort();
  }, [allEncounters]);

  const paginatedEncounters = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCompletedForms.slice(startIndex, endIndex);
  }, [filteredCompletedForms, currentPage, pageSize]);

  const goTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const encountersTableProps: EncountersTableProps = {
    currentPage,
    showFormNameFilter: true,
    formNameToFilter,
    setFormNameToFilter,
    availableFormNames,
    goTo,
    isLoading,
    pageSize,
    paginatedEncounters,
    patientUuid,
    setPageSize,
    showVisitType: true,
    totalCount: filteredCompletedForms.length,
    isSelectable: true,
    canPrintEncounters,
    onPrintStateChange,
  };

  return <EncountersTable {...encountersTableProps} />;
};

export default CompletedFormsTable;
