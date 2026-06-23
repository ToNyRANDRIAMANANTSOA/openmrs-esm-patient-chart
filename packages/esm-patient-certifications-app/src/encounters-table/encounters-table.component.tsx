import React, { type ComponentProps, useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';
import {
  Button,
  ComboBox,
  DataTable,
  DataTableSkeleton,
  Layer,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Search,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  Tile,
} from '@carbon/react';
import {
  EditIcon,
  isDesktop,
  launchWorkspace2,
  showModal,
  showSnackbar,
  TrashCanIcon,
  useConfig,
  useLayoutType,
  userHasAccess,
  useSession,
  type EncounterType,
  ExtensionSlot,
  useFeatureFlag,
  age,
  getPatientName,
  getCoreTranslation,
} from '@openmrs/esm-framework';
import { invalidateVisitAndEncounterData, usePatientChartStore } from '@openmrs/esm-patient-common-lib';
import { type ChartConfig } from '../config-schema';
import { jsonSchemaResourceName } from '../constants';
import {
  deleteEncounter,
  mapEncounter,
  useEncounterTypes,
  type EncountersTableProps,
  type MappedEncounter,
} from './encounters-table.resource';
import EncounterObservations from '../encounter-observations';
import styles from './encounters-table.scss';

const EncountersTable: React.FC<EncountersTableProps> = ({
  currentPage,
  encounterTypeToFilter,
  goTo,
  isLoading,
  pageSize,
  paginatedEncounters,
  patientUuid,
  setEncounterTypeToFilter,
  setPageSize,
  showEncounterTypeFilter,
  showFormNameFilter,
  formNameToFilter,
  setFormNameToFilter,
  availableFormNames,
  showVisitType,
  totalCount,
  isSelectable,
  canPrintEncounters,
  onSelectionChange,
}) => {
  const { t } = useTranslation();
  const pageSizes = [10, 20, 30, 40, 50];
  const desktopLayout = isDesktop(useLayoutType());
  const session = useSession();
  const { mutateVisitContext, patient } = usePatientChartStore(patientUuid);
  const { mutate } = useSWRConfig();
  const responsiveSize = 'lg';
  const { data: encounterTypes, isLoading: isLoadingEncounterTypes } = useEncounterTypes();
  const enableEmbeddedFormView = useFeatureFlag('enable-embedded-form-view');
  const { encounterEditableDuration, encounterEditableDurationOverridePrivileges } = useConfig<ChartConfig>();

  const config = useConfig();
  const excludePatientIdentifierCodeTypes = config?.excludePatientIdentifierCodeTypes;

  const patientDetails = useMemo(() => {
    const getGender = (gender: string): string => {
      switch (gender) {
        case 'male':
          return getCoreTranslation('male');
        case 'female':
          return getCoreTranslation('female');
        case 'other':
          return getCoreTranslation('other');
        case 'unknown':
          return getCoreTranslation('unknown');
        default:
          return gender;
      }
    };

    const identifiers =
      patient?.identifier?.filter(
        (identifier) => !excludePatientIdentifierCodeTypes?.uuids?.includes(identifier.type?.coding?.[0]?.code),
      ) ?? [];

    const familyName = patient?.name?.[0]?.family || '';
    const givenName = patient?.name?.[0]?.given?.join(' ') || '';
    const birthDate = patient?.birthDate || '';
    const address = patient?.address?.[0]
      ? [
          patient.address[0].line?.join(' '),
          patient.address[0].city,
          patient.address[0].state,
          patient.address[0].postalCode,
        ]
          .filter(Boolean)
          .join(', ')
      : '';

    return {
      name: patient ? getPatientName(patient) : '',
      age: age(patient?.birthDate),
      gender: getGender(patient?.gender),
      location: patient?.address?.[0]?.city || '',
      identifiers: identifiers?.length ? identifiers.map(({ value }) => value) : [],
      familyName,
      givenName,
      birthDate,
      address,
    };
  }, [patient, excludePatientIdentifierCodeTypes?.uuids]);

  const [selectedEncounters, setSelectedEncounters] = useState<MappedEncounter[]>([]);

  useEffect(() => {
    onSelectionChange?.({ selectedEncounters, patientDetails, patient });
  }, [selectedEncounters, patientDetails, onSelectionChange, patient]);

  const paginatedMappedEncounters = useMemo(
    () => (paginatedEncounters ?? []).map(mapEncounter).filter(Boolean),
    [paginatedEncounters],
  );

  const encountersByUuid = useMemo(
    () => new Map(paginatedMappedEncounters?.map((encounter) => [encounter.id, encounter]) ?? []),
    [paginatedMappedEncounters],
  );

  const handleChangeSelectedEncounters = useCallback(
    (selectedRows: Array<{ id: string }>) => {
      if (selectedRows.length !== selectedEncounters.length) {
        const selectedIds = new Set(selectedRows.map((r) => r.id));
        setSelectedEncounters(paginatedMappedEncounters.filter((enc) => selectedIds.has(enc.id)));
      }
    },
    [paginatedMappedEncounters, selectedEncounters.length],
  );

  const tableHeaders = [
    {
      header: t('dateAndTime', 'Date & time'),
      key: 'datetime',
    },
    {
      header: t('form', 'Form name'),
      key: 'formName',
    },
    {
      header: t('provider', 'Provider'),
      key: 'provider',
    },
    ...(showVisitType
      ? [
          {
            header: t('visitType', 'Visit type'),
            key: 'visitType',
          },
        ]
      : []),
    {
      header: t('encounterType', 'Encounter type'),
      key: 'encounterType',
    },
  ];

  const handleDeleteEncounter = useCallback(
    (encounterUuid: string, encounterTypeName?: string) => {
      const dispose = showModal('delete-encounter-modal', {
        close: () => dispose(),
        encounterTypeName: encounterTypeName || '',
        onConfirmation: () => {
          const abortController = new AbortController();
          deleteEncounter(encounterUuid, abortController)
            .then(() => {
              mutateVisitContext?.();
              invalidateVisitAndEncounterData(mutate, patientUuid);
              showSnackbar({
                isLowContrast: true,
                title: t('encounterDeleted', 'Encounter deleted'),
                subtitle: t('encounterSuccessfullyDeleted', 'The encounter has been deleted successfully'),
                kind: 'success',
              });
            })
            .catch(() => {
              showSnackbar({
                isLowContrast: false,
                title: t('error', 'Error'),
                subtitle: t(
                  'encounterWithError',
                  'The encounter could not be deleted successfully. If the error persists, please contact your system administrator.',
                ),
                kind: 'error',
              });
            });
          dispose();
        },
      });
    },
    [mutate, mutateVisitContext, patientUuid, t],
  );

  const handlePrintEncounter = useCallback(
    (encounter: MappedEncounter) => {
      const dispose = showModal('print-certifications-modal', {
        closeModal: () => dispose(),
        encounters: [encounter],
        patient,
      });
    },
    [patient],
  );

  if (isLoadingEncounterTypes || isLoading) {
    return <DataTableSkeleton role="progressbar" zebra />;
  }

  return (
    <div className={styles.container}>
      <DataTable
        headers={tableHeaders}
        overflowMenuOnHover={desktopLayout}
        rows={paginatedMappedEncounters ?? []}
        size={responsiveSize}
        useZebraStyles={totalCount > 1}
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getExpandHeaderProps,
          getToolbarProps,
          getTableProps,
          getSelectionProps,
          selectedRows,
          onInputChange,
        }: {
          headers: Array<{ header: React.ReactNode; key: string }>;
          rows: Array<{ id: string; isExpanded: boolean; cells: Array<{ id: string; value: React.ReactNode }> }>;
          [key: string]: any;
        }) => {
          handleChangeSelectedEncounters(selectedRows);
          return (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <Search
                    isExpanded
                    labelText={t('searchTable', 'Search table')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e)}
                    placeholder={t('searchTable', 'Search table')}
                  />
                  {showEncounterTypeFilter && (
                    <div className={styles.filterContainer}>
                      <ComboBox
                        aria-label={t('filterByEncounterType', 'Filter by encounter type')}
                        className={styles.substitutionType}
                        id="encounterTypeFilter"
                        items={encounterTypes}
                        itemToString={(item: EncounterType) => item?.display}
                        onChange={({ selectedItem }) => setEncounterTypeToFilter(selectedItem)}
                        placeholder={t('filterByEncounterType', 'Filter by encounter type')}
                        selectedItem={encounterTypeToFilter}
                        size={responsiveSize}
                      />
                    </div>
                  )}
                  {showFormNameFilter && (
                    <div className={styles.filterContainer}>
                      <ComboBox
                        id="formNameFilter"
                        items={availableFormNames ?? []}
                        itemToString={(item: string) => item ?? ''}
                        onChange={({ selectedItem }) => setFormNameToFilter?.(selectedItem ?? null)}
                        placeholder={t('filterByFormName', 'Filter by form name')}
                        selectedItem={formNameToFilter ?? null}
                        size={responsiveSize}
                      />
                    </div>
                  )}
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader enableToggle {...getExpandHeaderProps()} />
                    {isSelectable && canPrintEncounters && <TableSelectAll {...getSelectionProps()} />}
                    {headers.map((header, i) => (
                      <TableHeader className={styles.tableHeader} key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader aria-label={t('actions', 'Actions')} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => {
                    const encounter = encountersByUuid.get(row.id);

                    if (!encounter) return null;

                    const isVisitNoteEncounter = (encounter: MappedEncounter) =>
                      encounter.encounterType === 'Visit Note' && !encounter.form;

                    const supportsEmbeddedFormView = (encounter: MappedEncounter) =>
                      Boolean(encounter.form?.uuid) &&
                      Array.isArray(encounter.form?.resources) &&
                      encounter.form.resources.some((resource) => resource.name === jsonSchemaResourceName);
                    const encounterAgeInMinutes =
                      (Date.now() - new Date(encounter.rawDatetime).getTime()) / (1000 * 60);

                    const canDeleteEncounter =
                      userHasAccess(encounter.editPrivilege, session?.user) &&
                      (encounterEditableDuration === 0 ||
                        (encounterEditableDuration > 0 && encounterAgeInMinutes <= encounterEditableDuration) ||
                        (encounterEditableDurationOverridePrivileges ?? []).some((privilege) =>
                          userHasAccess(privilege, session?.user),
                        ));

                    const canEditEncounter =
                      canDeleteEncounter && (encounter.form?.uuid || isVisitNoteEncounter(encounter));

                    const canPrintEncounter = canPrintEncounters && supportsEmbeddedFormView(encounter);

                    return (
                      <React.Fragment key={encounter.id}>
                        <TableExpandRow {...getRowProps({ row })}>
                          {isSelectable && canPrintEncounters && <TableSelectRow {...getSelectionProps({ row })} />}
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                          <TableCell className="cds--table-column-menu">
                            <Layer className={styles.layer}>
                              {(canDeleteEncounter || canPrintEncounter) && (
                                <OverflowMenu
                                  aria-label={t('encounterTableActionsMenu', 'Encounter table actions menu')}
                                  flipped
                                  size={responsiveSize}
                                  align="left"
                                >
                                  {canEditEncounter && (
                                    <OverflowMenuItem
                                      className={styles.menuItem}
                                      itemText={t('editThisEncounter', 'Edit this encounter')}
                                      onClick={() => {
                                        if (isVisitNoteEncounter(encounter)) {
                                          launchWorkspace2('visit-notes-form-workspace', {
                                            encounter,
                                            formContext: 'editing',
                                            patientUuid,
                                          });
                                        } else {
                                          launchWorkspace2('patient-form-entry-workspace', {
                                            form: encounter.form,
                                            encounterUuid: encounter.id,
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                  {canPrintEncounter && (
                                    <OverflowMenuItem
                                      className={styles.menuItem}
                                      itemText={t('printEncounter', 'Print this encounter')}
                                      onClick={() => handlePrintEncounter(encounter)}
                                    />
                                  )}
                                  {canDeleteEncounter && (
                                    <OverflowMenuItem
                                      className={styles.menuItem}
                                      hasDivider
                                      isDelete
                                      itemText={t('deleteThisEncounter', 'Delete this encounter')}
                                      onClick={() => handleDeleteEncounter(encounter.id, encounter.form?.display)}
                                    />
                                  )}
                                </OverflowMenu>
                              )}
                            </Layer>
                          </TableCell>
                        </TableExpandRow>
                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedRow}
                            colSpan={headers.length + (isSelectable ? 3 : 2)}
                          >
                            <>
                              {enableEmbeddedFormView && supportsEmbeddedFormView(encounter) ? (
                                <ExtensionSlot
                                  name="form-widget-slot"
                                  state={{
                                    additionalProps: { mode: 'embedded-view' },
                                    visitUuid: encounter.visitUuid ?? null,
                                    visitTypeUuid: encounter.visitTypeUuid ?? null,
                                    visitStartDatetime: encounter.visitStartDatetime ?? null,
                                    visitStopDatetime: encounter.visitStopDatetime ?? null,
                                    patientUuid: patientUuid,
                                    patient: patient,
                                    formUuid: encounter.form.uuid,
                                    encounterUuid: encounter.id,
                                    promptBeforeClosing: () => {},
                                  }}
                                />
                              ) : (
                                <EncounterObservations observations={encounter.obs} />
                              )}
                              <>
                                {canEditEncounter && (
                                  <Button
                                    kind="ghost"
                                    onClick={() => {
                                      if (isVisitNoteEncounter(encounter)) {
                                        launchWorkspace2('visit-notes-form-workspace', {
                                          encounter,
                                          formContext: 'editing',
                                          patientUuid,
                                        });
                                      } else {
                                        launchWorkspace2('patient-form-entry-workspace', {
                                          form: encounter.form,
                                          encounterUuid: encounter.id,
                                        });
                                      }
                                    }}
                                    renderIcon={(props: ComponentProps<typeof EditIcon>) => (
                                      <EditIcon size={16} {...props} />
                                    )}
                                  >
                                    {t('editThisEncounter', 'Edit this encounter')}
                                  </Button>
                                )}
                                {canDeleteEncounter && (
                                  <Button
                                    kind="danger--ghost"
                                    onClick={() => handleDeleteEncounter(encounter.id, encounter.form?.display)}
                                    renderIcon={(props: ComponentProps<typeof TrashCanIcon>) => (
                                      <TrashCanIcon size={16} {...props} />
                                    )}
                                  >
                                    {t('deleteThisEncounter', 'Delete this encounter')}
                                  </Button>
                                )}
                              </>
                            </>
                          </TableExpandedRow>
                        ) : (
                          <TableExpandedRow
                            className={styles.hiddenRow}
                            colSpan={headers.length + (isSelectable ? 3 : 2)}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
              {rows?.length === 0 && (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>{t('noEncountersToDisplay', 'No encounters to display')}</p>
                      {((showEncounterTypeFilter && encounterTypeToFilter) ||
                        (showFormNameFilter && formNameToFilter)) && (
                        <p className={styles.helper}>{t('checkFilters', 'Check the filters above')}</p>
                      )}
                    </div>
                  </Tile>
                </div>
              )}
            </TableContainer>
          );
        }}
      </DataTable>
      <Pagination
        forwardText={t('nextPage', 'Next page')}
        backwardText={t('previousPage', 'Previous page')}
        page={currentPage}
        pageSize={pageSize}
        pageSizes={pageSizes}
        totalItems={totalCount}
        onChange={({ pageSize: newPageSize, page }) => {
          if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
          }
          if (page !== currentPage) {
            goTo(page);
          }
        }}
      />
    </div>
  );
};

export default EncountersTable;
