#!/bin/sh

echo "⚙️ tebokaroa custom packages build script"

# Usage: bulk_rename_pkg_scopes <scope> [add|remove] [prefix]
# Example: bulk_rename_pkg_scopes "@tebokaroa" add "custom"
#          bulk_rename_pkg_scopes "@openmrs"   remove "custom"
bulk_rename_pkg_scopes() {
    build_scope="${1}"
    prefix_action="${2:-}"
    prefix="${3:-}"

    commands='
    echo "Current package name:"
    npm pkg get name

    suffix=$(npm pkg get name --json | jq -r "to_entries | .[0].value" | cut -d/ -f2)

    if [ "$action" = "add" ] && [ -n "$pfx" ]; then
        new_name="$scope/$pfx-$suffix"
    elif [ "$action" = "remove" ] && [ -n "$pfx" ]; then
        stripped="${suffix#$pfx-}"
        new_name="$scope/$stripped"
    else
        new_name="$scope/$suffix"
    fi

    echo "Setting new name: $new_name"
    npm pkg set name="$new_name"

    echo "New package name: $(npm pkg get name)"
    echo "---"
    '

    yarn workspaces foreach --all --topological  -p -j 25 \
        --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
        exec sh -c "scope=$build_scope action=$prefix_action pfx=$prefix && $commands"

    # ⚠️ Rename every sub packages instead, 
    # if we decide to modify esm-patient-common-lib itself and have to make every packages depend on that
    
    # yarn workspaces foreach --all --topological -p -j 25 \
    # --exclude @openmrs/esm-patient-chart \
    # exec sh -c "scope=$build_scope && $commands"


    echo "Re-installing dependencies as package names changed"
    yarn install
}

# Usage: tebokaroa_publish [build_scope] [custom_scope] [prefix]
# Example: tebokaroa_publish "@openmrs" "@tebokaroa" "custom"
#   → renames  @openmrs/foo  to  @tebokaroa/custom-foo  before publishing
#   → reverts  @tebokaroa/custom-foo  back to  @openmrs/foo  after publishing
tebokaroa_publish() {
    build_scope="${1:-@openmrs}"
    custom_scope="${2:-@tebokaroa}"
    prefix="${3:-openmrs}"

    echo "Temporarily rename package with $custom_scope scope for custom publishing"

    bulk_rename_pkg_scopes "$custom_scope" add "$prefix"

    # -----------------


    echo "Publishing packages based on $custom_scope scope"

    # yarn workspaces foreach --all --topological \
    # --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    # npm publish --access public --tag latest

    yarn workspaces foreach --all --topological \
    -p -j 25 \
    --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    npm publish --access public --tag latest || {
        echo "Error: Publishing failed" >&2
        # Attempt to restore original names?
        bulk_rename_pkg_scopes "$build_scope" remove "$prefix"
        return 1
    }

    # echo "Custom Publishing finished, using the $custom_scope scope."


    # -----------------

    echo "Renaming package name back with $build_scope scope"
    bulk_rename_pkg_scopes "$build_scope" remove "$prefix"

    echo "---"
}

tebokaroa_publish