import type { FastifyReply, FastifyRequest } from "fastify";
import { createImageKit } from "../services/imagekit.service.js";

export async function getUploadAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const imagekit = createImageKit({
    publicKey: request.server.config.IMAGEKIT_PUBLIC_KEY,
    privateKey: request.server.config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: request.server.config.IMAGEKIT_URL_ENDPOINT,
  });

  const authenticationParameters =
    imagekit.getAuthenticationParameters();

  return reply.send({
    ...authenticationParameters,
    publicKey: request.server.config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: request.server.config.IMAGEKIT_URL_ENDPOINT,
  });
}