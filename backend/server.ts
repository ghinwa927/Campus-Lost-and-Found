import { buildApp } from "./app.js";

const app = buildApp();

const start = async () => {
  try {
    await app.ready();
    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST,
    });

     console.log(
      `🚀 Backend running at http://localhost:${app.config.PORT}`
    );

  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();