import type {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  if (error.validation) {
    const errors = error.validation.map((validationError) => {
      const params = validationError.params as {
        allowedValues?: unknown[];
        missingProperty?: string;
        format?: string;
        limit?: number;
      };

      const field =
        validationError.instancePath?.replace("/", "") ||
        params.missingProperty ||
        "request";

      let message = validationError.message ?? "Invalid value.";

      if (
        validationError.keyword === "enum" &&
        Array.isArray(params.allowedValues)
      ) {
        const allowedValues = params.allowedValues
          .map(String)
          .join("', '");

        message = `${field} must be one of '${allowedValues}'.`;
      }

      if (validationError.keyword === "required") {
        message = `${field} is required.`;
      }

      if (validationError.keyword === "format") {
        if (params.format === "email") {
          message = `${field} must be a valid email address.`;
        } else if (params.format === "date-time") {
          message = `${field} must be a valid date and time.`;
        }
      }

      if (validationError.keyword === "minLength") {
        message = `${field} must contain at least ${params.limit} characters.`;
      }

      return {
        field,
        message,
      };
    });

    return reply.code(400).send({
      message: "Validation failed",
      errors,
    });
  }

  if (error.message === "Invalid item ID") {
    return reply.code(400).send({
      message: "Invalid item ID.",
    });
  }

  if (error.message === "Invalid category ID") {
    return reply.code(400).send({
      message: "Invalid category ID.",
    });
  }

  if (error.message === "Category not found") {
    return reply.code(404).send({
      message: "Category not found.",
    });
  }

  return reply.code(500).send({
    message: "Internal server error.",
  });
}