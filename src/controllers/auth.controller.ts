import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthRequest, RegisterRequest } from "../types";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../utils/validators";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validation = registerSchema.parse(request.body as RegisterRequest);

  const user = await registerUser(validation, reply);

  const token = request.server.jwt.sign({ userId: user?.id });

  reply.status(201).send({
    user,
    token,
  });
};

export const login = async (
  request: FastifyRequest<{ Body: AuthRequest }>,
  reply: FastifyReply,
) => {
  const validation = loginSchema.parse(request.body as AuthRequest);

  const user = await loginUser(validation);

  const token = request.server.jwt.sign({ userId: user.id });

  reply.status(200).send({ user, token });
};
