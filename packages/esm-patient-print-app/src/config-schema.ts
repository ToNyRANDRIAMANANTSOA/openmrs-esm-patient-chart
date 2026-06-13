import { Type, validators } from '@openmrs/esm-framework';

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
};

export type ConfigSchema = {
  logo: {
    alt: string;
    name: string;
    src: string;
  };
};
