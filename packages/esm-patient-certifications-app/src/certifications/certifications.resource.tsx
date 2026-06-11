import useSWR from 'swr';
import { filter, includes, map, uniqBy } from 'lodash-es';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type {
  PatientCertification,
  Certification,
  CertificationWorkflowState,
  CertificationsFetchResponse,
} from '../types';

export const customRepresentation = `custom:(uuid,display,certification,dateEnrolled,dateCompleted,location:(uuid,display),states:(startDate,endDate,voided,state:(uuid,concept:(display))))`;

export function useEnrollments(patientUuid: string) {
  const enrollmentsUrl = `${restBaseUrl}/certificationenrollment?patient=${patientUuid}&v=${customRepresentation}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: CertificationsFetchResponse }, Error>(
    patientUuid ? enrollmentsUrl : null,
    openmrsFetch,
  );

  const formattedEnrollments =
    data?.data?.results.length > 0
      ? data?.data.results.sort((a, b) => (b.dateEnrolled > a.dateEnrolled ? 1 : -1))
      : null;

  const activeEnrollments = formattedEnrollments?.filter((enrollment) => !enrollment.dateCompleted);

  return {
    data: data ? uniqBy(formattedEnrollments, (certification) => certification?.certification?.uuid) : null,
    error,
    isLoading,
    isValidating,
    activeEnrollments,
    mutateEnrollments: mutate,
  };
}

export function useAvailableCertifications(enrollments?: Array<PatientCertification>) {
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Certification> } }, Error>(
    `${restBaseUrl}/certification?v=custom:(uuid,display,allWorkflows,concept:(uuid,display))`,
    openmrsFetch,
  );

  const availableCertifications = data?.data?.results ?? null;

  const eligibleCertifications = filter(
    availableCertifications,
    (certification) => !includes(map(enrollments, 'certification.uuid'), certification.uuid),
  );

  return {
    data: availableCertifications,
    error,
    isLoading,
    eligibleCertifications,
  };
}

export function createCertificationEnrollment(payload, abortController) {
  if (!payload) {
    return null;
  }
  const { certification, patient, dateEnrolled, dateCompleted, location, states } = payload;
  return openmrsFetch(`${restBaseUrl}/certificationenrollment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { certification, patient, dateEnrolled, dateCompleted, location, states },
    signal: abortController.signal,
  });
}

export function updateCertificationEnrollment(certificationEnrollmentUuid: string, payload, abortController) {
  if (!payload && !payload.certification) {
    return null;
  }
  const { dateEnrolled, dateCompleted, location, states } = payload;
  return openmrsFetch(`${restBaseUrl}/certificationenrollment/${certificationEnrollmentUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { dateEnrolled, dateCompleted, location, states },
    signal: abortController.signal,
  });
}

export function deleteCertificationEnrollment(certificationEnrollmentUuid: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${restBaseUrl}/certificationenrollment/${certificationEnrollmentUuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}

export const useCertifications = (patientUuid: string) => {
  const {
    data: enrollments,
    error: enrollError,
    isLoading: enrolLoading,
    isValidating,
    activeEnrollments,
  } = useEnrollments(patientUuid);
  const { data: availableCertifications, eligibleCertifications } = useAvailableCertifications(enrollments);

  const status = { isLoading: enrolLoading, error: enrollError };
  return {
    enrollments,
    ...status,
    isValidating,
    activeEnrollments,
    availableCertifications,
    eligibleCertifications,
  };
};

export const findLastState = (states: CertificationWorkflowState[]): CertificationWorkflowState => {
  const activeStates = states.filter((state) => !state.voided);
  const ongoingState = activeStates.find((state) => !state.endDate);

  if (ongoingState) {
    return ongoingState;
  }

  return activeStates.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
};
