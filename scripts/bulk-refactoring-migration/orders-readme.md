

Trace the Chain (dependency analysis)

```shell
npx madge --image scripts/bulk-refactoring-migration/orders-dependency-graph.png packages/esm-patient-common-lib-tebokaroa/src/index.ts
```

Find Exports Artifacts

```shell
rg -l "export" packages/esm-patient-common-lib-tebokaroa
```
TODO: Update `scripts/bulk-refactoring-migration/orders-exports.txt` and `scripts/bulk-refactoring-migration/orders-migrate-imports.ts` accordingly


Find All Affected Imports (The Consumer Search)

```shell
rg -l "@openmrs/esm-patient-common-lib" packages/esm-patient-orders-app/ packages/esm-patient-medications-app/
```


MIGRATION (bulk update the imports to also use `esm-patient-common-lib-tebokaroa`)

```shell
npx tsx scripts/bulk-refactoring-migration/orders-migrate-imports.ts
```

REVIEW DIFFs

```shell
git diff HEAD . > scripts/bulk-refactoring-migration/orders-git-diff-after-imports-refactoring-migration.diff
```

VERIFICATIONS
TYPESCRIPT VALIDATION (After migration)

```shell
yarn turbo run lint typescript test --filter={@openmrs/esm-patient-orders-app,@openmrs/esm-patient-medications-app,@openmrs/esm-patient-tests-app} --color --concurrency=5
```
or
```shell
yarn turbo run typecheck
```
Or peek in the Problems console.


AUTO FORMAT (lint, import ordering, empty imports, formatting)

```shell
yarn eslint --fix
yarn prettier .
```


BUILD
```shell
yarn build
```