import type { FastifyInstance } from "fastify";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";

export default async function categoryRoutes(
  fastify: FastifyInstance
) {
  fastify.get("/", getCategories);

  fastify.get("/:id", getCategory);

  fastify.post(
    "/",
    {
      schema: createCategorySchema,
    },
    createCategory
  );

  fastify.put(
    "/:id",
    {
      schema: updateCategorySchema,
    },
    updateCategory
  );

  fastify.delete("/:id", deleteCategory);
}