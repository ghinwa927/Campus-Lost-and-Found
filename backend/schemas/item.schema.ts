export const createItemSchema = {
  body: {
    type: "object",
    required: [
      "title",
      "type",
      "categoryId",
      "description",
      "location",
      "date",
      "reporterName",
      "reporterEmail",
    ],
    additionalProperties: false,
    properties: {
      title: {
        type: "string",
        minLength: 2,
      },
      type: {
        type: "string",
        enum: ["lost", "found"],
      },
      categoryId: {
        type: "string",
        minLength: 1,
      },
      description: {
        type: "string",
        minLength: 2,
      },
      location: {
        type: "string",
        minLength: 2,
      },
      date: {
        type: "string",
        format: "date-time",
      },
      imageUrl: {
        type: "string",
      },
      reporterName: {
        type: "string",
        minLength: 2,
      },
      reporterEmail: {
        type: "string",
        format: "email",
      },
    },
  },
} as const;

export const updateItemSchema = {
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: {
      title: {
        type: "string",
        minLength: 2,
      },
      type: {
        type: "string",
        enum: ["lost", "found"],
      },
      categoryId: {
        type: "string",
        minLength: 1,
      },
      description: {
        type: "string",
        minLength: 2,
      },
      location: {
        type: "string",
        minLength: 2,
      },
      date: {
        type: "string",
        format: "date-time",
      },
      imageUrl: {
        type: "string",
      },
      reporterName: {
        type: "string",
        minLength: 2,
      },
      reporterEmail: {
        type: "string",
        format: "email",
      },
      status: {
        type: "string",
        enum: ["active", "resolved"],
      },
    },
  },
} as const;