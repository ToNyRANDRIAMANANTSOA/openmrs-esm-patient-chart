import React, { type ComponentProps, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLayoutType, isDesktop as desktopLayout, AddIcon, launchWorkspace2 } from '@openmrs/esm-framework';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import CompletedFormsTable from './completed-forms-table.component';
import styles from './certifications-detailed-summary.scss';
import { Button } from '@carbon/react';

interface MedicalCertificationsProps {
  patientUuid: string;
  basePath: string;
}

const MedicalCertifications: React.FC<MedicalCertificationsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isDesktop = desktopLayout(layout);
  const launchProgramsForm = useCallback(() => launchWorkspace2('programs-form-workspace'), []);

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('medicalCertifications', 'Medical Certifications')}>
        <Button
          kind="ghost"
          renderIcon={(props: ComponentProps<typeof AddIcon>) => <AddIcon size={16} {...props} />}
          iconDescription={t('addPrograms', 'Add programs')}
          onClick={launchProgramsForm}
        >
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <CompletedFormsTable patientUuid={patientUuid} isTabActive />
    </div>
  );
};

export default MedicalCertifications;
