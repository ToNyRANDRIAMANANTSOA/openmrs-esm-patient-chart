#!/usr/bin/env tsx

import { IndentationText, NewLineKind, Project, QuoteKind } from 'ts-morph';
import { migratedExports } from './orders-exports';

const OLD_LIB = '@openmrs/esm-patient-common-lib';
const NEW_LIB = '@openmrs/esm-patient-common-lib-tebokaroa';

const TARGET_GLOBS = [
  'packages/esm-patient-orders-app/src/**/*.{ts,tsx}',
  'packages/esm-patient-medications-app/src/**/*.{ts,tsx}',
];

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',

  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    newLineKind: NewLineKind.LineFeed,
    quoteKind: QuoteKind.Single,
    useTrailingCommas: true,
  },
});

async function main() {
  const sourceFiles = project.getSourceFiles();

  let updatedFiles = 0;

  for (const sourceFile of sourceFiles) {
    let fileChanged = false;

    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      if (moduleSpecifier !== OLD_LIB) {
        continue;
      }

      const namedImports = importDecl.getNamedImports();

      if (namedImports.length === 0) {
        continue;
      }

      const importsToMove: { name: string; isTypeOnly: boolean }[] = [];
      const importsToKeep: { name: string; isTypeOnly: boolean }[] = [];

      for (const namedImport of namedImports) {
        const importName = namedImport.getName();

        const importData = {
          name: importName,
          isTypeOnly: namedImport.isTypeOnly(),
        };

        if (migratedExports.has(importName)) {
          importsToMove.push(importData);
        } else {
          importsToKeep.push(importData);
        }
      }

      if (importsToMove.length === 0) {
        continue;
      }

      fileChanged = true;

      // all moved
      if (importsToKeep.length === 0) {
        importDecl.setModuleSpecifier(NEW_LIB);

        console.log(`[FULL MOVE] ${sourceFile.getBaseName()} -> ${importsToMove.join(', ')}`);

        continue;
      }

      // split imports
      importDecl.removeNamedImports();

      importDecl.addNamedImports(
        importsToKeep
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            name: item.name,
            isTypeOnly: item.isTypeOnly,
          })),
      );

      let newLibImport = importDeclarations.find((d) => d.getModuleSpecifierValue() === NEW_LIB);

      if (!newLibImport) {
        newLibImport = sourceFile.addImportDeclaration({
          moduleSpecifier: NEW_LIB,
          namedImports: [],
        });
      }

      const existingNames = new Set(newLibImport.getNamedImports().map((i) => i.getName()));

      for (const movedImport of importsToMove.sort((a, b) => a.name.localeCompare(b.name))) {
        if (!existingNames.has(movedImport.name)) {
          newLibImport.addNamedImport({
            name: movedImport.name,
            isTypeOnly: movedImport.isTypeOnly,
          });
        }
      }

      console.log(
        `[SPLIT] ${sourceFile.getBaseName()}
  moved: ${importsToMove.join(', ')}
  kept : ${importsToKeep.join(', ')}`,
      );
    }

    if (fileChanged) {
      sourceFile.organizeImports();
      updatedFiles++;
    }
  }

  await project.save();

  console.log(`
========================================
Migration complete.
Updated files: ${updatedFiles}
========================================
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
