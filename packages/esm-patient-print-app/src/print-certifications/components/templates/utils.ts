export {
  getObsValue,
  getObsByConceptKeywords,
  formatDateLong,
  formatBirthDate,
  calcDurationDays,
  formatDurationDays,
} from '../old/templates/utils';

/** Recursively flattens obs groups into leaf obs entries. */
export function flattenObs(obsList: any[]): any[] {
  return (obsList ?? []).flatMap((obs) => (obs.groupMembers?.length ? flattenObs(obs.groupMembers) : [obs]));
}
