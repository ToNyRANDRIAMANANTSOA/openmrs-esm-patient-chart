import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { launchWorkspace2, showModal, useLayoutType } from '@openmrs/esm-framework';
import styles from './certifications-action-menu.scss';

interface CertificationActionsProps {
  patientUuid: string;
  certificationEnrollmentId: string;
}

export const CertificationsActionMenu = ({ patientUuid, certificationEnrollmentId }: CertificationActionsProps) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';

  const launchEditCertificationsForm = useCallback(
    () =>
      launchWorkspace2('certifications-form-workspace', {
        workspaceTitle: t('editCertificationEnrollment', 'Edit certification enrollment'),
        certificationEnrollmentId,
      }),
    [certificationEnrollmentId, t],
  );

  const launchDeleteCertificationDialog = useCallback(() => {
    const dispose = showModal('certification-delete-confirmation-modal', {
      closeDeleteModal: () => dispose(),
      certificationEnrollmentId,
      patientUuid,
      size: 'sm',
    });
  }, [certificationEnrollmentId, patientUuid]);

  return (
    <Layer className={styles.layer}>
      <OverflowMenu
        aria-label={t('editOrDeleteCertification', 'Edit or delete certification')}
        align="left"
        flipped
        size={isTablet ? 'lg' : 'sm'}
      >
        <OverflowMenuItem
          className={styles.menuItem}
          id="editCertification"
          itemText={t('edit', 'Edit')}
          onClick={launchEditCertificationsForm}
        />
        <OverflowMenuItem
          className={styles.menuItem}
          id="deleteProgam"
          hasDivider
          isDelete
          itemText={t('delete', 'Delete')}
          onClick={launchDeleteCertificationDialog}
        />
      </OverflowMenu>
    </Layer>
  );
};
