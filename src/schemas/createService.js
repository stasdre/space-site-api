export const createService = {
  type: 'object',
  properties: {
    active: {
      type: 'boolean',
    },
    ServiceCategoryId: {
      type: 'string',
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
        h2: {
          type: 'string',
        },
        video_name: {
          type: 'string',
        },
        video_prev: {
          type: 'string',
        },
        video_url: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        main_title: {
          type: 'string',
        },
        name: {
          type: 'string',
          minLength: 3,
        },
        url: {
          type: 'string',
          minLength: 3,
        },
        works: {
          type: 'array',
        },
        reviews: {
          type: 'array',
        },
        desc_hash: {
          type: 'string',
          minLength: 3,
        },
        desc: {
          type: 'string',
          minLength: 3,
        },
        advantage: {
          type: 'array',
        },
        price_hash: {
          type: 'string',
          minLength: 3,
        },
        price: {
          type: 'array',
        },
        more_hash: {
          type: 'string',
          minLength: 3,
        },
        more: {
          type: 'string',
          minLength: 3,
        },
      },
      required: ['meta_title'],
      additionalProperties: false,
    },
  },
  additionalProperties: false,
  required: ['active'],
};
