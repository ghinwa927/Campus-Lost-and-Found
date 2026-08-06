import type { FastifyReply, FastifyRequest } from "fastify";
import { ItemRepository } from "../repositories/item.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import type { ItemQuery } from "../types/item-query.types.js";
import { ItemService } from "../services/item.service.js";
import type {
  CreateItemInput,
  UpdateItemInput,
} from "../types/item.types.js";

const getService = (request: FastifyRequest) => {
  const itemRepository = new ItemRepository(request.server.mongo.db);
  const categoryRepository = new CategoryRepository(
    request.server.mongo.db
  );

  return new ItemService(
    itemRepository,
    categoryRepository
  );
};

export async function getItems(
  request: FastifyRequest<{
    Querystring: ItemQuery;
  }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const result = await service.getAllItems(request.query);

  return reply.send(result);
}

export async function getItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const item = await service.getItemById(request.params.id);

  if (!item) {
    return reply.code(404).send({
      message: "Item not found",
    });
  }

  return reply.send(item);
}

export async function createItem(
  request: FastifyRequest<{ Body: CreateItemInput }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const item = await service.createItem(request.body);

  return reply.code(201).send(item);
}

export async function updateItem(
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateItemInput;
  }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const item = await service.updateItem(
    request.params.id,
    request.body
  );

  if (!item) {
    return reply.code(404).send({
      message: "Item not found",
    });
  }

  return reply.send(item);
}

export async function deleteItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const result = await service.deleteItem(request.params.id);

  if (result.deletedCount === 0) {
    return reply.code(404).send({
      message: "Item not found",
    });
  }

  return reply.send({
    message: "Item deleted successfully",
  });
}