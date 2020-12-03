export const createWork = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    WorkTypeId: {
      type: 'string',
      minLength: 3,
    },
    active: {
      type: 'boolean',
    },
  },
  required: ['name', 'WorkTypeId', 'active'],
  additionalProperties: true,
};
