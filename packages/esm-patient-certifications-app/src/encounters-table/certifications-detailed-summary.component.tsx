import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AddIcon,
  ExtensionSlot,
  isDesktop,
  launchWorkspace2,
  useLayoutType,
  useSession,
  userHasAccess,
} from '@openmrs/esm-framework';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { Button } from '@carbon/react';
import CompletedFormsTable from './completed-forms-table.component';
import styles from './certifications-detailed-summary.scss';

interface MedicalCertificationsProps {
  patientUuid: string;
  basePath: string;
}

const MedicalCertifications: React.FC<MedicalCertificationsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? 'sm' : 'lg';
  const session = useSession();
  // const canPrintEncounters = userHasAccess('Front: Print Certifications', session?.user);
  const canPrintEncounters = userHasAccess('App: Print encounter forms', session?.user);
  const launchClinicalForms = useCallback(() => launchWorkspace2('clinical-forms-workspace'), []);

  const [selectionState, setSelectionState] = useState<{
    selectedEncounters: any[];
    patientDetails: any;
    patient: any;
  } | null>(null);

  const handleSelectionChange = useCallback(
    (state: { selectedEncounters: any[]; patientDetails: any; patient: any } | null) => {
      setSelectionState(state);
    },
    [],
  );

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('medicalCertifications', 'Medical Certifications')}>
        <div className={styles.buttons}>
          {canPrintEncounters && (
            <ExtensionSlot
              name="certifications-selections-actions-slot"
              state={{
                selectedEncounters: selectionState?.selectedEncounters ?? [],
                patientDetails: selectionState?.patientDetails ?? {},
                size: responsiveSize,
                patientUuid: patientUuid,
                patient: selectionState?.patient,
              }}
            />
          )}
          <Button
            kind="ghost"
            renderIcon={(props: ComponentProps<typeof AddIcon>) => <AddIcon size={16} {...props} />}
            iconDescription={t('addCertification', 'Add certification')}
            onClick={launchClinicalForms}
          >
            {t('add', 'Add')}
          </Button>
        </div>
      </CardHeader>
      <CompletedFormsTable
        patientUuid={patientUuid}
        isTabActive
        canPrintEncounters={canPrintEncounters}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default MedicalCertifications;
