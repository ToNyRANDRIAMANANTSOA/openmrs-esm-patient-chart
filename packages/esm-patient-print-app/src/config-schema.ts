import { Type, validators } from '@openmrs/esm-framework';

const qrCodeValueTypes = ['patient_uuid', 'visit_uuid', 'none'] as const;
const qrBottomTextSources = ['patient_identifier', 'visit_label', 'custom', 'none'] as const;
const headerAlignments = ['left', 'center', 'right'] as const;

type HeaderAlignmentDefault = (typeof headerAlignments)[number];

const headerConfigSchema = (defaults: {
  showProviderInfo: boolean;
  showClinicInfo: boolean;
  showFacilityAddress: boolean;
  sideAAlignment: HeaderAlignmentDefault;
  sideBAlignment: HeaderAlignmentDefault;
  titleAndLogoInSharedRow: boolean;
  showHeaderBorderBottom: boolean;
}) => ({
  titleAndLogoInSharedRow: {
    _type: Type.Boolean,
    _default: defaults.titleAndLogoInSharedRow,
    _description:
      'When true, the title and logo share a top row above the A/B columns, and are hidden from inside those columns. When false, the title appears at the top of column A and the logo at the top of column B.',
  },
  showProviderInfo: {
    _type: Type.Boolean,
    _default: defaults.showProviderInfo,
    _description: 'Show provider name, title, and license info in column A of the print header.',
  },
  showClinicInfo: {
    _type: Type.Boolean,
    _default: defaults.showClinicInfo,
    _description: 'Show clinic/facility display name in column B of the print header.',
  },
  showFacilityAddress: {
    _type: Type.Boolean,
    _default: defaults.showFacilityAddress,
    _description: 'Show contact, email, and address in column B of the print header.',
  },
  sideAAlignment: {
    _type: Type.String,
    _default: defaults.sideAAlignment,
    _description: 'Horizontal alignment of column A content. Options: "left", "center", "right".',
    _validators: [validators.oneOf([...headerAlignments])],
  },
  sideBAlignment: {
    _type: Type.String,
    _default: defaults.sideBAlignment,
    _description: 'Horizontal alignment of column B content. Options: "left", "center", "right".',
    _validators: [validators.oneOf([...headerAlignments])],
  },
  showHeaderBorderBottom: {
    _type: Type.Boolean,
    _default: defaults.showHeaderBorderBottom,
    _description: 'Show a border line below the header.',
  },
});

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

const patientDetailsConfigSchema = (defaults: {
  useLargerFontSize: boolean;
  showBorders: boolean;
  borderPadding: number;
}) => ({
  useLargerFontSize: {
    _type: Type.Boolean,
    _default: defaults.useLargerFontSize,
    _description: 'Use a larger font size for patient details text.',
  },
  showBorders: {
    _type: Type.Boolean,
    _default: defaults.showBorders,
    _description: 'Show border lines around the patient details section.',
  },
  borderPadding: {
    _type: Type.Number,
    _default: defaults.borderPadding,
    _description: 'Padding (in pixels) around the patient details section when borders are shown.',
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
    header: headerConfigSchema({
      titleAndLogoInSharedRow: true,
      showProviderInfo: true,
      showClinicInfo: true,
      showFacilityAddress: true,
      sideAAlignment: 'left',
      sideBAlignment: 'right',
      showHeaderBorderBottom: true,
    }),
    showPatientIdentifierRow: {
      _type: Type.Boolean,
      _default: true,
      _description: 'When true, displays an extra row above the patient name showing the patient OpenMRS identifier.',
    },
    patientDetails: patientDetailsConfigSchema({
      useLargerFontSize: false,
      showBorders: false,
      borderPadding: 12,
    }),
    leftQrCode: qrCodeConfigSchema('none', 'none'),
    rightQrCode: qrCodeConfigSchema('visit_uuid', 'visit_label'),
  },
  certificatesPrint: {
    header: headerConfigSchema({
      titleAndLogoInSharedRow: false,
      showProviderInfo: true,
      showClinicInfo: true,
      showFacilityAddress: false,
      sideAAlignment: 'center',
      sideBAlignment: 'center',
      showHeaderBorderBottom: true,
    }),
    showPatientIdentifierRow: {
      _type: Type.Boolean,
      _default: true,
      _description: 'When true, displays an extra row above the patient name showing the patient OpenMRS identifier.',
    },
    patientDetails: patientDetailsConfigSchema({
      useLargerFontSize: false,
      showBorders: false,
      borderPadding: 12,
    }),
    leftQrCode: qrCodeConfigSchema('none', 'none'),
    rightQrCode: qrCodeConfigSchema('visit_uuid', 'visit_label'),
  },
};

type QrCodeValueType = (typeof qrCodeValueTypes)[number];
type QrBottomTextSource = (typeof qrBottomTextSources)[number];
export type HeaderAlignment = (typeof headerAlignments)[number];

type QrCodeConfig = {
  valueType: QrCodeValueType;
  bottomTextSource: QrBottomTextSource;
  bottomTextCustomValue: string;
};

export type PatientDetailsConfig = {
  useLargerFontSize: boolean;
  showBorders: boolean;
  borderPadding: number;
};

export type HeaderConfig = {
  titleAndLogoInSharedRow: boolean;
  showProviderInfo: boolean;
  showClinicInfo: boolean;
  showFacilityAddress: boolean;
  sideAAlignment: HeaderAlignment;
  sideBAlignment: HeaderAlignment;
  showHeaderBorderBottom: boolean;
};

export type ConfigSchema = {
  logo: {
    alt: string;
    name: string;
    src: string;
  };
  prescriptionsPrint: {
    header: HeaderConfig;
    showPatientIdentifierRow: boolean;
    patientDetails: PatientDetailsConfig;
    leftQrCode: QrCodeConfig;
    rightQrCode: QrCodeConfig;
  };
  certificatesPrint: {
    header: HeaderConfig;
    showPatientIdentifierRow: boolean;
    patientDetails: PatientDetailsConfig;
    leftQrCode: QrCodeConfig;
    rightQrCode: QrCodeConfig;
  };
};
