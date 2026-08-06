export const itemQuerySchema = {
  querystring: {
    type: "object",
    additionalProperties: false,

    properties: {
      page: {
        type: "integer",
        minimum: 1,
        default: 1,
      },

      limit: {
        type: "integer",
        minimum: 1,
        maximum: 50,
        default: 10,
      },

      search: {
        type: "string",
        minLength: 1,
      },

      type: {
        type: "string",
        enum: ["lost", "found"],
      },

      categoryId: {
        type: "string",
      },

      location: {
        type: "string",
        minLength: 1,
      },

      status: {
        type: "string",
        enum: ["active", "resolved"],
      },
    },
  },
};