import fp from "fastify-plugin";
import { MongoClient, Db } from "mongodb";

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    };
  }
}

export default fp(async (fastify) => {
  const client = new MongoClient(fastify.config.MONGODB_URI);

  await client.connect();
  console.log("✅ MongoDB connected successfully");
  const db = client.db(fastify.config.MONGODB_DB_NAME);

  await db.command({ ping: 1 });

  fastify.decorate("mongo", {
    client,
    db,
  });

  fastify.log.info("MongoDB connected successfully");

  fastify.addHook("onClose", async () => {
    await client.close();
  });
});