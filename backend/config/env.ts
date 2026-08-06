export interface Env {
  PORT: number;
  HOST: string;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
  IMAGEKIT_PUBLIC_KEY: string;
  IMAGEKIT_PRIVATE_KEY: string;
  IMAGEKIT_URL_ENDPOINT: string;
}

export const envSchema = {
  type: "object",
  required: [
    "PORT",
    "HOST",
    "MONGODB_URI",
    "MONGODB_DB_NAME",
    "IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "IMAGEKIT_URL_ENDPOINT",
  ],
  properties: {
    PORT: {
      type: "number",
      default: 5000,
    },
    HOST: {
      type: "string",
      default: "0.0.0.0",
    },
    MONGODB_URI: {
      type: "string",
    },
    MONGODB_DB_NAME: {
      type: "string",
    },
    IMAGEKIT_PUBLIC_KEY: {
      type: "string",
    },

    IMAGEKIT_PRIVATE_KEY: {
      type: "string",
    },

    IMAGEKIT_URL_ENDPOINT: {
      type: "string",
    },
  },
} as const;

declare module "fastify" {
  interface FastifyInstance {
    config: Env;
  }
}