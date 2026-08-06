export interface Env {
  PORT: number;
  HOST: string;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
}

export const envSchema = {
  type: "object",
  required: [
    "PORT",
    "HOST",
    "MONGODB_URI",
    "MONGODB_DB_NAME",
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
  },
} as const;

declare module "fastify" {
  interface FastifyInstance {
    config: Env;
  }
}