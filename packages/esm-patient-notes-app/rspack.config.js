const config = require('openmrs/default-rspack-config');

config.scriptRuleConfig.exclude = /node_modules\/(?!(@openmrs|@tebokaroa)\/esm-patient-common-lib)/;

module.exports = config;
