#!/bin/sh

# Usage: rename_pkg_scopes [scope] [all|selected]
# Example: rename_pkg_scopes "@tebokaroa" all
#          rename_pkg_scopes "@tebokaroa" selected
bulk_rename_pkg_scopes() {
    # Parameter handling with defaults
    new_scope="${1:-@tebokaroa}"
    rename_mode="${2:-all}"  # 'all' or 'selected'
    
    # Validation
    if [ "$rename_mode" != "all" ] && [ "$rename_mode" != "selected" ]; then
        echo "Error: Second parameter must be 'all' or 'selected'" >&2
        echo "Usage: bulk_rename_pkg_scopes [scope] [all|selected]" >&2
        return 1
    fi
    
    # Check required files/tools
    if ! command -v jq >/dev/null 2>&1; then
        echo "Error: jq is required but not installed" >&2
        return 1
    fi
    
    if [ "$rename_mode" = "selected" ] && [ ! -f "tebokaroa-maintained-custom-packages.txt" ]; then
        echo "Error: tebokaroa-maintained-custom-packages.txt not found" >&2
        return 1
    fi
    
    # Commands as a function for better readability
    rename_package() {
        local scope="$1"
        echo "Current package name:"
        npm pkg get name
        
        suffix=$(npm pkg get name --json | jq -r 'to_entries | .[0].value' | cut -d/ -f2)
        new_name="$scope/$suffix"
        
        echo "Setting new name: $new_name"
        npm pkg set name="$new_name"
        
        echo "New package name: $(npm pkg get name)"
        echo "---"
    }
    
    export -f rename_package
    
    # Execute based on mode
    if [ "$rename_mode" = "all" ]; then
        echo "Renaming ALL packages..."
        
        # ⚠️ Rename every sub package 
        # because they will all be modified to use our custom esm-patient-common-lib
        
        yarn workspaces foreach --all --topological \
            --exclude @openmrs/esm-patient-chart \
            exec sh -c "rename_package \"$new_scope\""
    else
        echo "Renaming SELECTED packages from tebokaroa-maintained-custom-packages.txt..."
        
        # Build include list from file
        include_list=$(paste -sd, tebokaroa-maintained-custom-packages.txt)
        
        if [ -z "$include_list" ]; then
            echo "Error: No packages found in tebokaroa-maintained-custom-packages.txt" >&2
            return 1
        fi
        
        yarn workspaces foreach --all --topological \
            --include "{$include_list}" \
            exec sh -c "rename_package \"$new_scope\""
    fi
    
    # Reinstall dependencies
    echo "Re-installing dependencies as package names changed"
    yarn install
}

# Properly quote the parameter
bulk_rename_pkg_scopes "$1" "$2"