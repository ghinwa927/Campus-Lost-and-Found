export const createCategorySchema = {
  body: {
    type: "object",
    required: ["name", "slug"],
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        minLength: 2,
      },
      slug: {
        type: "string",
        minLength: 2,
      },
      icon: {
        type: "string",
      },
    },
  },
} as const;

export const updateCategorySchema = {
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        minLength: 2,
      },
      slug: {
        type: "string",
        minLength: 2,
      },
      icon: {
        type: "string",
      },
    },
  },
} as const;