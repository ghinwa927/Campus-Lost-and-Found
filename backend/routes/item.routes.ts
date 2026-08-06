import type { FastifyInstance } from "fastify";

import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.js";

import {
  createItemSchema,
  updateItemSchema,
} from "../schemas/item.schema.js";
import { itemQuerySchema } from "../schemas/item-query.schema.js";

export default async function itemRoutes(
  fastify: FastifyInstance
) {
  fastify.get("/",{
      schema: itemQuerySchema,
    }, getItems);

  fastify.get("/:id", getItem);

  fastify.post(
    "/",
    {
      schema: createItemSchema,
    },
    createItem
  );

  fastify.put(
    "/:id",
    {
      schema: updateItemSchema,
    },
    updateItem
  );

  fastify.delete("/:id", deleteItem);
}