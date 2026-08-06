import type { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepository } from "../repositories/category.repository.js";
import { CategoryService } from "../services/category.service.js";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../types/category.types.js";

const getService = (request: FastifyRequest) => {
  const repository = new CategoryRepository(request.server.mongo.db);

  return new CategoryService(repository);
};

export async function getCategories(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const service = getService(request);

  const categories = await service.getAllCategories();

  return reply.send(categories);
}

export async function getCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const category = await service.getCategoryById(request.params.id);

  if (!category) {
    return reply.code(404).send({
      message: "Category not found",
    });
  }

  return reply.send(category);
}

export async function createCategory(
  request: FastifyRequest<{ Body: CreateCategoryInput }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const category = await service.createCategory(request.body);

  return reply.code(201).send(category);
}

export async function updateCategory(
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateCategoryInput;
  }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const category = await service.updateCategory(
    request.params.id,
    request.body
  );

  if (!category) {
    return reply.code(404).send({
      message: "Category not found",
    });
  }

  return reply.send(category);
}

export async function deleteCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const service = getService(request);

  const result = await service.deleteCategory(request.params.id);

  if (result.deletedCount === 0) {
    return reply.code(404).send({
      message: "Category not found",
    });
  }

  return reply.send({
    message: "Category deleted successfully",
  });
}