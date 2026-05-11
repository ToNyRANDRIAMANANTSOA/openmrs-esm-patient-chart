#!/bin/sh

echo "Updating package.json files for each customized packages..."


echo "Setting shared libraries metadata separately (we don't want it to depend on itself)"
yarn workspaces foreach --all --topological \
  --include packages/esm-patient-common-lib \
  exec sh -c '
  echo "Setting name"
  npm pkg get name
  SUFFIX=$(npm pkg get name --json | jq -r "to_entries | .[0].value" | cut -d/ -f2)
  npm pkg set name="@tebokaroa/$SUFFIX"

  echo "Setting repository.url"
  npm pkg set repository.url="git+https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git"
  echo "Setting homepage"
  npm pkg set homepage="https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git#readme"
  echo "Setting bugs.url"
  npm pkg set bugs.url="https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git/issues"
'

commands='
  echo "Setting name"
  npm pkg get name
  SUFFIX=$(npm pkg get name --json | jq -r "to_entries | .[0].value" | cut -d/ -f2)
  npm pkg set name="@tebokaroa/$SUFFIX"

  echo "Setting repository.url"
  npm pkg set repository.url="git+https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git"
  echo "Setting homepage"
  npm pkg set homepage="https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git#readme"
  echo "Setting bugs.url"
  npm pkg set bugs.url="https://github.com/ToNyRANDRIAMANANTSOA/openmrs-esm-patient-chart.git/issues"

  echo "Setting dependencies versions to aliased versions"
  echo "setting peerDependencies.@openmrs/esm-patient-common-lib"
  npm pkg set "peerDependencies.@openmrs/esm-patient-common-lib"="npm:@tebokaroa/esm-patient-common-lib@latest"
  echo "Setting devDependencies.@openmrs/esm-patient-common-lib" 
  npm pkg set "devDependencies.@openmrs/esm-patient-common-lib"="workspace:packages/esm-patient-common-lib"
'

# Edit only current custom packages
# yarn workspaces foreach --all --topological \
#   --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
#   exec sh -c "$commands"

# ⚠️ edit all packages instead
yarn workspaces foreach --all --topological \
  --exclude @openmrs/esm-patient-chart \
  --exclude packages/esm-patient-common-lib \
  exec sh -c "$commands"


# ⚠️ We don't need to modify the root package.json, 
# it's 'private: true' after all and won't be published
# and yarn workspace kinda fails if we modify its name

# echo "Setting main package metadata"
# echo "Setting name"
# npm pkg get name
# npm pkg set name="@tebokaroa/$(npm pkg get name | tr -d '"' | cut -d/ -f2)"
