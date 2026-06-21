# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

This session focuses exclusively on `packages/esm-patient-certifications-app` — a custom microfrontend for managing and printing medical certifications in OpenMRS 3.x SPA.

## Commands

All commands are run from the monorepo root. The package manager is **Yarn 4**.

```bash
# Install dependencies
yarn

# Start dev server for certifications app
yarn start --sources 'packages/esm-patient-certifications-app'

# Run all tests for this package only
yarn turbo run test --filter=@openmrs/esm-patient-certifications-app

# Run a specific test file
yarn turbo run test --filter=@openmrs/esm-patient-certifications-app -- encounters-table

# Run tests in watch mode
yarn turbo run test:watch --filter=@openmrs/esm-patient-certifications-app

# TypeScript check
yarn turbo run typescript --filter=@openmrs/esm-patient-certifications-app

# Lint
yarn turbo run lint --filter=@openmrs/esm-patient-certifications-app

# Extract i18n translation keys
yarn turbo run extract-translations --filter=@openmrs/esm-patient-certifications-app

# Full verify (lint + types + tests)
yarn verify
```

## Package Architecture

```
packages/esm-patient-certifications-app/src/
├── index.ts                        # Registers extensions, workspaces, modals with OpenMRS
├── routes.json                     # Extension slots, workspace, modal declarations
├── config-schema.ts                # Config types (hideAddProgramButton, showProgramStatusField, + shared ChartConfig)
├── constants.ts                    # Shared constants
├── dashboard.meta.ts               # Dashboard link metadata
│
├── encounters-table/
│   ├── certifications-detailed-summary.component.tsx  # Dashboard panel entry point
│   ├── completed-forms-table.component.tsx            # Fetches/filters encounters, owns pagination + print permission check
│   ├── encounters-table.component.tsx                 # Table UI + print trigger (react-to-print)
│   ├── encounters-table.resource.ts                   # SWR hooks, REST calls, mapEncounter(), downloadPdf()
│   └── all-encounters-table.component.tsx             # Alternative table view (all encounters)
│
├── print/
│   ├── print.component.tsx         # PrintComponent: renders a certificate page (delegates to a template)
│   ├── registry.ts                 # certificatesRegistry + getCertificateConfig() — maps encounter/form text to a template
│   └── templates/
│       ├── utils.ts                # getObsByConceptKeywords(), getObsValue(), formatBirthDate()
│       ├── GeneralCertificateTemplate.tsx   # Fallback template
│       ├── BirthCertificateTemplate.tsx
│       ├── DeathCertificateTemplate.tsx
│       ├── DivingFitnessTemplate.tsx
│       ├── FitToFlyTemplate.tsx
│       ├── GoodHealthTemplate.tsx
│       ├── NonContagionTemplate.tsx
│       ├── SchoolCertificateTemplate.tsx
│       └── SportsFitnessTemplate.tsx
│
├── programs/                       # Certification enrollment (workspace form, delete modal, overview/summary)
├── encounter-observations/         # Reusable obs display component used in templates and expanded rows
└── types/index.ts
```

## Print System

The print flow for a single encounter or a batch selection:

1. **`CompletedFormsTable`** — filters encounters to those backed by a JSON schema form (`encounterHasJsonSchemaForm`), checks the `App: Print encounter forms` privilege via `userHasAccess`.
2. **`EncountersTable`** — on "Print selected" or individual overflow menu, calls `handlePrint()` (via `react-to-print`). A hidden `div` (`contentToPrintRef`) holds one `PrintComponent` per encounter.
3. **`PrintComponent`** — calls `getCertificateConfig(subheader, encounter)` to pick a template and renders it. The common header/patient band/signature sections on `PrintComponent` are currently all disabled (`showCommonHeader: false`, etc.) — each template renders its own full layout.
4. **`getCertificateConfig`** — keyword-matches against obs values (via `getObsByConceptKeywords`), form name, encounter type name, and the `subheader` string (the active encounter type filter display name). Falls back to `GENERAL`.
5. **`getObsByConceptKeywords`** — traverses `obs` and `obs.groupMembers` recursively, matching concept display names (case-insensitive, partial match) against a list of French/English keywords.

### Adding a new certificate type

1. Create `src/print/templates/MyTemplate.tsx` (receives `{ patientDetails, encounter }`).
2. Add an entry to `certificatesRegistry` in `registry.ts` with the new key.
3. Add a keyword-matching branch in `getCertificateConfig`.

## Key External APIs

- **`openmrsFetch`** / **`useOpenmrsFetchAll`** / **`useOpenmrsPagination`** — from `@openmrs/esm-framework`. All REST calls go through these.
- **Encounter REST representation** — custom rep requested in `encountersCustomRep` (in `encounters-table.resource.ts`) includes obs with `groupMembers`, form resources, and encounter providers.
- **`downloadPdf`** — calls a custom OpenMRS module endpoint (`/ws/rest/v1/patientdocuments/encounters`) that generates a server-side PDF, then polls for completion and triggers a browser download.

## Lint Rules to Follow

- Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`).
- Import Carbon components from `@carbon/react`, icons from `@carbon/react/icons` (not `@carbon/icons-react`).
- Import lodash methods individually from `lodash-es` (e.g. `import { debounce } from 'lodash-es'`), never the default export.
- `console.log` is forbidden — use `console.warn` or `console.error`.

## i18n

Translation keys are extracted automatically from files matching `*.component.tsx`, `*.modal.tsx`, `*.workspace.tsx`, `*.hook.tsx`, and `src/index.ts`. The base translation file is `translations/en.json`. French translations live in `translations/fr.json`.

Always wrap user-visible strings with `t('key', 'Default English text')`.
