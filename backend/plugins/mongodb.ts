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

const DEFAULT_CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "💻" },
  { name: "Bags", slug: "bags", icon: "🎒" },
  { name: "Personal Items", slug: "personal-items", icon: "🧳" },
  { name: "Books", slug: "books", icon: "📚" },
  { name: "Keys", slug: "keys", icon: "🗝️" },
  { name: "Phone", slug: "phone", icon: "📱" },
  { name: "Student ID", slug: "student-id", icon: "🪪" },
  { name: "General", slug: "general", icon: "📦" },
];

async function ensureDefaultCategories(db: Db) {
  const collection = db.collection("categories");
  const now = new Date();

  for (const category of DEFAULT_CATEGORIES) {
    await collection.updateOne(
      { slug: category.slug },
      {
        $setOnInsert: {
          ...category,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );
  }
}

export default fp(async (fastify) => {
  const client = new MongoClient(fastify.config.MONGODB_URI);

  await client.connect();
  console.log("✅ MongoDB connected successfully");
  const db = client.db(fastify.config.MONGODB_DB_NAME);

  await db.command({ ping: 1 });
  await ensureDefaultCategories(db);

  fastify.decorate("mongo", {
    client,
    db,
  });

  fastify.log.info("MongoDB connected successfully");

  fastify.addHook("onClose", async () => {
    await client.close();
  });
});