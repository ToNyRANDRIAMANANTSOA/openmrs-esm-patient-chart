import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { ArrowLeft } from '@carbon/react/icons';
import { ErrorState, isDesktop, navigate, useLayoutType } from '@openmrs/esm-framework';
import { EmptyState } from '@openmrs/esm-patient-common-lib';
import { spaBasePath } from '../../constants';
import { useVisitByUuid } from '../../patient-chart/patient-chart.resources';
import { customRepresentation, usePaginatedVisits } from '../visits-widget/visit.resource';
import VisitActionsCell from './visit-actions-cell.component';
import VisitDateCell from './visit-date-cell.component';
import VisitDiagnosisCell from './visit-diagnoses-cell.component';
import VisitSummary from '../visits-widget/past-visits-components/visit-summary.component';
import VisitTypeCell from './visit-type-cell.component';
import styles from './visit-history-table.scss';

interface VisitHistoryTableProps {
  patientUuid: string;
  patient: fhir.Patient;
  /**
   * When provided, the table shows only this single visit (expanded by default) instead of the
   * full paginated list, along with a "Back to all visits" button.
   */
  visitUuid?: string;
}

/**
 * This show a list of visit histories in the visit tab in patient chart
 */
const VisitHistoryTable: React.FC<VisitHistoryTableProps> = ({ patientUuid, patient, visitUuid }) => {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const pageSizes = [10, 20, 30, 40, 50];
  const isSingleVisitView = Boolean(visitUuid);

  const {
    data: paginatedVisits,
    currentPage,
    error: paginatedError,
    isLoading: isLoadingPaginated,
    totalCount,
    goTo,
  } = usePaginatedVisits(isSingleVisitView ? null : patientUuid, pageSize);
  const {
    visit: singleVisit,
    error: singleVisitError,
    isLoading: isLoadingSingleVisit,
  } = useVisitByUuid(visitUuid ?? null, customRepresentation);

  const visits = isSingleVisitView ? (singleVisit ? [singleVisit] : []) : paginatedVisits;
  const isLoading = isSingleVisitView ? isLoadingSingleVisit : isLoadingPaginated;
  const error = isSingleVisitView ? singleVisitError : paginatedError;

  const { t } = useTranslation();
  const desktopLayout = isDesktop(useLayoutType());

  const handleBackToAllVisits = () => {
    navigate({ to: `${spaBasePath.replace(':patientUuid', patientUuid)}/visits` });
  };

  // TODO: make this configurable
  const columns = [
    { key: 'visitDate', header: t('date', 'Date'), CellComponent: VisitDateCell },
    { key: 'visitType', header: t('visitType', 'Visit type'), CellComponent: VisitTypeCell },
    { key: 'diagnoses', header: t('diagnoses', 'Diagnoses'), CellComponent: VisitDiagnosisCell },
    { key: 'actions', header: '', CellComponent: VisitActionsCell },
  ];

  const layout = useLayoutType();

  const rowData = visits?.map((visit) => {
    const row: Record<string, JSX.Element | string> = { id: visit.uuid };
    for (const { key, CellComponent } of columns) {
      row[key] = <CellComponent key={key} visit={visit} patient={patient} />;
    }
    return row;
  });

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact={isDesktop(layout)} zebra />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('pastVisits', 'Past visits')} />;
  }

  const backToAllVisitsButton = isSingleVisitView ? (
    <Button
      className={styles.backButton}
      kind="ghost"
      renderIcon={ArrowLeft}
      iconDescription={t('backToAllVisits', 'Back to all visits')}
      onClick={handleBackToAllVisits}
      size={desktopLayout ? 'sm' : 'lg'}
    >
      {t('backToAllVisits', 'Back to all visits')}
    </Button>
  ) : null;

  if (visits.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        {backToAllVisitsButton}
        <EmptyState headerTitle={t('pastVisits', 'Past visits')} displayText={t('visits', 'visits')} />
      </div>
    );
  }
  return (
    <>
      {backToAllVisitsButton}
      <div className={styles.container}>
        {/* @ts-ignore */}
        <DataTable headers={columns} rows={rowData} size={desktopLayout ? 'sm' : 'lg'} useZebraStyles>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getExpandHeaderProps,
            getRowProps,
            getExpandedRowProps,
          }) => (
            <>
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      <TableExpandHeader enableToggle {...getExpandHeaderProps()} />
                      {headers.map((header) => (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            className: header.key === 'actions' ? styles.actionsColumn : '',
                          })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => {
                      const visit = visits[i];
                      return (
                        <React.Fragment key={row.id}>
                          <TableExpandRow {...getRowProps({ row })}>
                            {row.cells.map((cell) => {
                              return <TableCell key={cell.id}>{cell?.value}</TableCell>;
                            })}
                          </TableExpandRow>
                          {row.isExpanded || isSingleVisitView ? (
                            <TableExpandedRow {...getExpandedRowProps({ row })} colSpan={headers.length + 2}>
                              <VisitSummary visit={visit} patientUuid={patientUuid} />
                            </TableExpandedRow>
                          ) : (
                            <TableExpandedRow className={styles.hiddenRow} colSpan={headers.length + 2} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {!isSingleVisitView && (
                <Pagination
                  forwardText={t('nextPage', 'Next page')}
                  backwardText={t('previousPage', 'Previous page')}
                  page={currentPage}
                  pageSize={pageSize}
                  pageSizes={pageSizes}
                  totalItems={totalCount}
                  onChange={({ pageSize, page }) => {
                    setPageSize(pageSize);
                    if (page !== currentPage) {
                      goTo(page);
                    }
                  }}
                />
              )}
            </>
          )}
        </DataTable>
      </div>
    </>
  );
};

export default VisitHistoryTable;
