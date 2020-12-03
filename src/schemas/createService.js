import { works } from '../routers';

export const createService = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    active: {
      type: 'boolean',
    },
    works: {
      type: 'array',
    },
  },
  required: ['name', 'active', 'works'],
  additionalProperties: true,
};
