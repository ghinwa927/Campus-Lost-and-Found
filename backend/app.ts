import Fastify from "fastify";
import env from "@fastify/env";

import { envSchema } from "./config/env.js";
import corsPlugin from "./plugins/cors.js";
import mongodbPlugin from "./plugins/mongodb.js";

import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";

import { errorHandler } from "./middleware/error-handler.js";

export function buildApp() {
   const app = Fastify({
    logger: true,
  });


  app.setErrorHandler(errorHandler);

  app.register(env, {
    schema: envSchema,
    dotenv: true,
  });

  app.register(corsPlugin);

  app.register(mongodbPlugin);

  app.get("/", async () => {
    return {
      message: "Campus Lost & Found API is running 🚀",
    };
  });

  app.register(categoryRoutes, {
    prefix: "/api/categories",
  });

  app.register(itemRoutes, {
    prefix: "/api/items",
  });

  return app;
}