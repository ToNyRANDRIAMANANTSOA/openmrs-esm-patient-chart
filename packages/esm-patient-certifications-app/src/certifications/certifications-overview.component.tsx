import React, { type ComponentProps, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  InlineNotification,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { CardHeader, EmptyState, ErrorState, PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import {
  AddIcon,
  type ConfigObject,
  formatDate,
  formatDatetime,
  launchWorkspace2,
  useConfig,
  useLayoutType,
  usePagination,
  isDesktop as desktopLayout,
} from '@openmrs/esm-framework';
import { type ConfigurableCertification } from '../types';
import { findLastState, useCertifications } from './certifications.resource';
import { CertificationsActionMenu } from './certifications-action-menu.component';
import styles from './certifications-overview.scss';

interface CertificationsOverviewProps {
  basePath: string;
  patientUuid: string;
}

const CertificationsOverview: React.FC<CertificationsOverviewProps> = ({ basePath, patientUuid }) => {
  const certificationsCount = 5;
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const displayText = t('certificationEnrollmentsLower', 'certification enrollments');
  const headerTitle = t('careCertifications', 'Care Certifications');
  const urlLabel = t('seeAll', 'See all');
  const pageUrl = `\${openmrsSpaBase}/patient/${patientUuid}/chart/certifications`;
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);

  const {
    activeEnrollments,
    availableCertifications,
    eligibleCertifications,
    enrollments,
    error,
    isLoading,
    isValidating,
  } = useCertifications(patientUuid);

  const { results: paginatedEnrollments, goTo, currentPage } = usePagination(enrollments ?? [], certificationsCount);

  const enrollmentsByUuid = useMemo(
    () => new Map(paginatedEnrollments?.map((enrollment) => [enrollment.uuid, enrollment]) ?? []),
    [paginatedEnrollments],
  );

  const launchCertificationsForm = useCallback(() => launchWorkspace2('certifications-form-workspace'), []);

  const tableHeaders = [
    {
      key: 'display',
      header: t('activeCertifications', 'Active certifications'),
    },
    {
      key: 'location',
      header: t('location', 'Location'),
    },
    {
      key: 'dateEnrolled',
      header: t('dateEnrolled', 'Date enrolled'),
    },
    {
      key: 'status',
      header: t('status', 'Status'),
    },
    {
      key: 'state',
      header: t('state', 'State'),
    },
    {
      key: 'actions',
      header: t('actions', 'Actions'),
    },
  ];

  const tableRows = useMemo(() => {
    return paginatedEnrollments?.map((enrollment: ConfigurableCertification) => {
      const state = enrollment ? findLastState(enrollment.states) : null;
      return {
        id: enrollment.uuid,
        display: enrollment.display,
        location: enrollment.location?.display ?? '--',
        dateEnrolled: enrollment.dateEnrolled ? formatDatetime(new Date(enrollment.dateEnrolled)) : '--',
        status: enrollment.dateCompleted
          ? `${t('completedOn', 'Completed On')} ${formatDate(new Date(enrollment.dateCompleted))}`
          : t('active', 'Active'),
        state: state ? state.state.concept.display : '--',
      };
    });
  }, [paginatedEnrollments, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (enrollments?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
          {config.hideAddCertificationButton ? null : (
            <Button
              kind="ghost"
              renderIcon={(props: ComponentProps<typeof AddIcon>) => <AddIcon size={16} {...props} />}
              iconDescription="Add certifications"
              onClick={launchCertificationsForm}
              disabled={availableCertifications?.length && eligibleCertifications?.length === 0}
            >
              {t('add', 'Add')}
            </Button>
          )}
        </CardHeader>
        {availableCertifications?.length && eligibleCertifications?.length === 0 && (
          <InlineNotification
            style={{ minWidth: '100%', margin: '0', padding: '0' }}
            kind={'info'}
            lowContrast
            subtitle={t('noEligibleEnrollments', 'There are no more certifications left to enroll this patient in')}
            title={t('fullyEnrolled', 'Enrolled in all certifications')}
          />
        )}
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
            <TableContainer>
              <Table aria-label="certifications overview" {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        className={classNames(styles.productiveHeading01, styles.text02)}
                        {...getHeaderProps({
                          header,
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const enrollment = enrollmentsByUuid.get(row.id);

                    return (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ))}
                        {enrollment && (
                          <TableCell className="cds--table-column-menu">
                            <CertificationsActionMenu
                              patientUuid={patientUuid}
                              certificationEnrollmentId={enrollment.uuid}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <PatientChartPagination
          currentItems={paginatedEnrollments.length}
          onPageNumberChange={({ page }) => goTo(page)}
          pageNumber={currentPage}
          pageSize={certificationsCount}
          totalItems={enrollments?.length}
          dashboardLinkUrl={pageUrl}
          dashboardLinkLabel={urlLabel}
        />
      </div>
    );
  }

  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchCertificationsForm} />;
};

export default CertificationsOverview;
