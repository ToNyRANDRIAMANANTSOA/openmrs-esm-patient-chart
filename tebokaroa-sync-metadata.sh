#!/bin/bash

# Simplified workspace sync script
# Usage: ./tebokaroa-sync-metadata.sh [dry-run] [tebokaroa-model-package.json]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

export -f print_info
export -f print_success
export -f print_warning
export -f print_error

SELF_PACKAGE="@openmrs/esm-patient-common-lib"

# Function to convert dot notation to jq bracket notation
# Example: "dependencies.@openmrs/pkg" -> ".dependencies[\"@openmrs/pkg\"]"
to_jq_path() {
    local path="$1"
    # Split by dots
    local parts=(${path//./ })
    local result=""
    
    for part in "${parts[@]}"; do
        if [[ "$part" =~ [@/] ]]; then
            # Part has special characters, use bracket notation
            result="${result}[\"${part}\"]"
        else
            # Normal part, use dot notation
            if [ -z "$result" ]; then
                result=".$part"
            else
                result="${result}.${part}"
            fi
        fi
    done
    echo "$result"
}

export -f to_jq_path

sync_workspace() {
    local model_file="../../$1"
    local dry_run="$2"
        
    # Get workspace name
    local workspace_name=$(jq -r '.name' package.json 2>/dev/null)
        
    print_warning "Processing: $workspace_name \n"
    
    # Get all keys from model file
    local keys=$(jq -r 'paths(scalars) as $p | $p | map(tostring) | join(".")' "$model_file")
    
    # print_info "Keys:\n $keys"

    local updated=0
    
    while IFS= read -r key; do
        [ -z "$key" ] && continue
        
        # Skip self dependencies
        if [ "$workspace_name" = "$SELF_PACKAGE" ] && \
           [[ "$key" == "peerDependencies.$SELF_PACKAGE" ]] || \
           [[ "$key" == "devDependencies.$SELF_PACKAGE" ]] || \
           [[ "$key" == "dependencies.$SELF_PACKAGE" ]]; then
            print_warning "  Skipping self-dependency: $key"
            continue
        fi
        
        # Get values
        # Get model value - convert to jq path
        local jq_path=$(to_jq_path "$key")
        local model_value=$(jq -r "$jq_path" "$model_file")
        # local jq_safe_key=$(echo "$key" | sed 's/\.@/\["@/g' | sed 's/\(@[^.]*\)/\1"]/g')
        # local model_value=$(jq -r ".$jq_safe_key" "$model_file")
        [ "$model_value" = "null" ] && continue
        
        # local current_value=$(npm pkg get "$key" 2>/dev/null | jq -r '.' 2>/dev/null || echo "null")
        local current_value=$(npm pkg get "$key" --json | jq -r "to_entries | .[0].value" )
        
        print_info "---"
        print_info "key: $key"
        print_info "model_value: $model_value"
        print_info "current_value: $current_value"

        # Update if different
        if [ "$current_value" != "{}" ] && [ "$current_value" != "$model_value" ]; then
            if [ "$dry_run" = "false" ]; then
                print_info "  [RUN] Updating the above"
                npm pkg set "$key=$model_value"
                updated=$((updated + 1))
            else
                print_info "  [DRY RUN] Would update the above"
                updated=$((updated + 1))
            fi
        fi
        print_info "---\n"
    done <<< "$keys"
    
    echo "  Updated $updated keys"
    echo ""
}

export -f sync_workspace

main() {
    local dry_run="${1:-false}"
    local model_file="${2:-tebokaroa-model-package.json}"
    
    # Validation
    if [ ! -f "$model_file" ]; then
        print_error "Model file not found: $model_file"
        return 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_error "jq is required"
        return 1
    fi
    
    if [[ "$dry_run" =~ ^(dry-run|dry_run|true)$ ]]; then
        dry_run="true"
        print_warning "DRY RUN MODE"
    else
        dry_run="false"
        print_info "LIVE MODE"
    fi
    
    print_info "Model: $model_file"
    print_info "Self package: $SELF_PACKAGE"
    echo ""

    # -p (Parallel): Runs the command in multiple workspaces at the same time.
    # -t (--topological): Applies the topological wait rules.
    # -j (Jobs): Limits the number of concurrent processes (e.g., -j 4 for 4 concurrent jobs).
    # -i (Interlaced): Prints the output of your processes in real-time. If not set, Yarn will buffer the logs until each process completes.
    yarn workspaces foreach --all \
    -pt -j 25 \
    --exclude @openmrs/esm-patient-chart \
    exec sh -c "sync_workspace '$model_file' '$dry_run'"
    
    
    if [ "$dry_run" = "false" ]; then
        echo ""
        print_warning "Re-Installing Dependencies..."
        yarn install
        print_success "Dependencies reinstalled"

        # read -p "Run yarn install? (y/n): " -n 1 -r
        # echo ""
        # if [[ $REPLY =~ ^[Yy]$ ]]; then
        #     yarn install
        #     print_success "Dependencies reinstalled"
        # fi
    fi
}

# Run main function
main "$1" "$2"