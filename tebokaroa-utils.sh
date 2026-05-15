#!/bin/sh

# Usage: rename_pkg_scope [scope]
# Example: rename_pkg_scope "@tebokaroa"
rename_pkg_scope() {
    scope="${1:-@tebokaroa}"
    
    echo "Current package name:"
    npm pkg get name
    
    suffix=$(npm pkg get name --json | jq -r "to_entries | .[0].value" | cut -d/ -f2)
    new_name="$scope/$suffix"
    
    echo "Setting new name: $new_name"
    npm pkg set name="$new_name"
    
    echo "New package name: $(npm pkg get name)"
    echo "---"
}

# Usage: rename_pkg_scopes [scope]
# Example: rename_pkg_scopes "@tebokaroa"
bulk_rename_pkg_scopes() {
    build_scope="${1:-@tebokaroa}"

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

# # If script is executed directly (not sourced), show usage
# if [ "${0#*$0}" != "$0" ] 2>/dev/null; then
#     echo "===== tebokaroa utils ====="
#     echo "This script is meant to be sourced, not executed directly."
#     echo "Usage: source tebokaroa-utils.sh && rename_pkg_scope [scope]"
# fi


