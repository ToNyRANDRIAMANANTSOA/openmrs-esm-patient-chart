// module.exports = require('openmrs/default-rspack-config');

// rspack.config.js
// For a pure shared library package, not a separate micro-frontend.

// rspack.config.js

const path = require('path');

module.exports = {
  mode: 'production',

  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'openmrs-esm-patient-common-lib.js',
    library: {
      type: 'module',
    },
    module: true,
    clean: true,
  },

  experiments: {
    outputModule: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  externals: {
    react: 'react',
    'single-spa': 'single-spa',
    '@openmrs/esm-framework': '@openmrs/esm-framework',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            target: 'es2020',
          },
        },
      },
    ],
  },
};
