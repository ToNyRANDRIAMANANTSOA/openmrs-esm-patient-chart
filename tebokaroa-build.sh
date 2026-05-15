#!/bin/sh


# This script is no longer used:
# Changed workflow to: 
# normal build (using package.json script) without package rename
# -> rename packages with @tebokaroa scope
# -> publish with @tebokaroa scope
# -> rename back packages with @openmrs scope
# -> use @tebokaroa scoped alias when consuming the custom packages as dependencies


















# ---------------------------------
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

    yarn workspaces foreach --all --topological \
        --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
        exec sh -c "scope=$build_scope && $commands"

    echo "Re-installing dependencies as package names changed"
    yarn install
}

# Usage: tebokaroa_build [build_scope] [custom_scope]
# Example: tebokaroa_build "@openmrs" "@tebokaroa"
tebokaroa_build() {
    build_scope="${1:-@openmrs}"
    custom_scope="${2:-@tebokaroa}"
    
    echo "Processing package for tebokaroa build and publishing"
    echo "Basing build output on $build_scope scope"
    
    # # Check if we're in a package directory
    # if [ ! -f "package.json" ]; then
    #     echo "Error: No package.json found in current directory" >&2
    #     return 1
    # fi
    
    bulk_rename_pkg_scopes "$build_scope"

    echo "Building packages based on $build_scope scope"

    yarn workspaces foreach --all --topological \
    --include "{$(paste -sd, tebokaroa-maintained-custom-packages.txt)}" \
    --exclude "packages/esm-patient-common-lib" \
    run build || {
        echo "Error: Build failed" >&2
        # Attempt to restore original names?
        bulk_rename_pkg_scopes "$custom_scope"
        
        return 1
    }
    
    echo "tebokaroa builds finished."

    echo "Renaming package name back with $custom_scope scope (for custom publishing)"
    bulk_rename_pkg_scopes "$custom_scope"
    
    echo "---"
}

tebokaroa_build