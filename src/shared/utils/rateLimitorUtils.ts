import type { FastifyRequest } from "fastify";

const rateLimiter = (
  allowedRequest: number,
  timeWindow: number | string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customMessage?: string,
) => ({
  max: allowedRequest,
  timeWindow,
  keyGenerator: (request: FastifyRequest) => {
    return request.ip;
  },
});

export { rateLimiter };
