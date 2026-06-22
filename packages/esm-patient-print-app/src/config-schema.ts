import { Type, validators } from '@openmrs/esm-framework';

const qrCodeValueTypes = ['patient_uuid', 'visit_uuid', 'none'] as const;
const qrBottomTextSources = ['patient_identifier', 'visit_label', 'custom', 'none'] as const;

const qrCodeConfigSchema = (defaultValueType: string, defaultBottomTextSource: string) => ({
  valueType: {
    _type: Type.String,
    _default: defaultValueType,
    _description: 'What to encode in the QR code. Options: "patient_uuid", "visit_uuid", "none".',
    _validators: [validators.oneOf([...qrCodeValueTypes])],
  },
  bottomTextSource: {
    _type: Type.String,
    _default: defaultBottomTextSource,
    _description:
      'What to display below the QR code. Options: "patient_identifier" (OpenMRS patient ID), "visit_label" (static "Visit Details" label), "custom" (see bottomTextCustomValue), "none".',
    _validators: [validators.oneOf([...qrBottomTextSources])],
  },
  bottomTextCustomValue: {
    _type: Type.String,
    _default: '',
    _description: 'Text to display below the QR code when bottomTextSource is "custom".',
  },
});

export const configSchema = {
  logo: {
    alt: {
      _type: Type.String,
      _default: 'Logo',
      _description: 'Alt text, shown on hover',
    },
    name: {
      _type: Type.String,
      _default: '',
      _description: 'The organization name displayed when image is absent',
    },
    src: {
      _type: Type.String,
      _default: '',
      _description: 'A path or URL to an image. Defaults to the OpenMRS SVG sprite.',
    },
  },
  prescriptionsPrint: {
    showPatientIdentifierRow: {
      _type: Type.Boolean,
      _default: true,
      _description: 'When true, displays an extra row above the patient name showing the patient OpenMRS identifier.',
    },
    leftQrCode: qrCodeConfigSchema('none', 'none'),
    rightQrCode: qrCodeConfigSchema('visit_uuid', 'visit_label'),
  },
  certificatesPrint: {
    showPatientIdentifierRow: {
      _type: Type.Boolean,
      _default: true,
      _description: 'When true, displays an extra row above the patient name showing the patient OpenMRS identifier.',
    },
    leftQrCode: qrCodeConfigSchema('none', 'none'),
    rightQrCode: qrCodeConfigSchema('visit_uuid', 'visit_label'),
  },
};

type QrCodeValueType = (typeof qrCodeValueTypes)[number];
type QrBottomTextSource = (typeof qrBottomTextSources)[number];

type QrCodeConfig = {
  valueType: QrCodeValueType;
  bottomTextSource: QrBottomTextSource;
  bottomTextCustomValue: string;
};

export type ConfigSchema = {
  logo: {
    alt: string;
    name: string;
    src: string;
  };
  prescriptionsPrint: {
    showPatientIdentifierRow: boolean;
    leftQrCode: QrCodeConfig;
    rightQrCode: QrCodeConfig;
  };
  certificatesPrint: {
    showPatientIdentifierRow: boolean;
    leftQrCode: QrCodeConfig;
    rightQrCode: QrCodeConfig;
  };
};
