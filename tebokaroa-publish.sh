#!/bin/sh

echo "⚙️ tebokaroa custom packages build script"

# Usage: rename_pkg_scopes [scope]
# Example: rename_pkg_scopes "@tebokaroa"
bulk_rename_pkg_scopes() {
    build_scope="${1}"

    commands='
    echo "Current package name:"
    npm pkg get name
    
    suffix=$(npm pkg get name --json | jq -r "to_entries | .[0].value" | cut -d/ -f2)
    new_name="$scope/$suffix"
    
    echo "Setting new name: $new_name"
    npm pkg set name="$new_name"
    
    echo "New package name: $(npm pkg get name)"
    echo "---"
    '

    # yarn workspaces foreach --all --topological \
    #     --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    #     exec sh -c "scope=$build_scope && $commands"

    # ⚠️ Rename every sub packages instead, 
    # because they will all be modified to use our custom esm-patient-common-lib
    
    yarn workspaces foreach --all --topological \
    --exclude @openmrs/esm-patient-chart \
    exec sh -c "scope=$build_scope && $commands"


    echo "Re-installing dependencies as package names changed"
    yarn install
}

# Usage: tebokaroa_publish [build_scope] [custom_scope]
# Example: tebokaroa_publish "@openmrs" "@tebokaroa"
tebokaroa_publish() {
    build_scope="${1:-@openmrs}"
    custom_scope="${2:-@tebokaroa}"
    
    echo "Temporarily rename package with $custom_scope scope for custom publishing"
        
    bulk_rename_pkg_scopes "$custom_scope"

    # -----------------


    echo "Publishing packages based on $custom_scope scope"

    yarn workspaces foreach --all --topological \
    --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    npm publish --access public --tag latest 

    # yarn workspaces foreach --all --topological \
    # --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    # npm publish --access public --tag latest || {
    #     echo "Error: Publishing failed" >&2
    #     # Attempt to restore original names?
    #     bulk_rename_pkg_scopes "$build_scope"
    #     return 1
    # }
    
    # echo "Custom Publishing finished, using the $custom_scope scope."


    # -----------------

    echo "Renaming package name back with $build_scope scope"
    bulk_rename_pkg_scopes "$build_scope"
    
    echo "---"
}

tebokaroa_publish