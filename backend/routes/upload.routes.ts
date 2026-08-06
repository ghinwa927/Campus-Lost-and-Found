import type { FastifyInstance } from "fastify";
import { getUploadAuth } from "../controllers/upload.controller.js";

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.get("/auth", getUploadAuth);
}