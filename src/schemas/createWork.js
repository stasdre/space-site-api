export const createWork = {
  type: 'object',
  properties: {
    WorkTypeId: {
      type: 'string',
      minLength: 3,
    },
    active: {
      type: 'boolean',
    },
  },
  patternProperties: {
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}': {
      type: 'object',
      properties: {
        meta_title: {
          type: 'string',
          minLength: 3,
        },
        meta_desc: {
          type: 'string',
          minLength: 3,
        },
        h1: {
          type: 'string',
          minLength: 3,
        },
        url: {
          type: 'string',
          minLength: 3,
        },
        name: {
          type: 'string',
          minLength: 3,
        },
      },
      required: ['url', 'name'],
      additionalProperties: true,
    },
  },
  required: ['WorkTypeId', 'active'],
  additionalProperties: true,
};
