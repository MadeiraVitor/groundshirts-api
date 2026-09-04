import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterRequest } from "../types";
import {
  registerUser,
} from "../services/auth.service";


export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {


  const user = await registerUser(request.body as RegisterRequest, reply);

  const token = request.server.jwt.sign({ userId: user?.id });

  

  reply.status(201).send({
    user,
    token
  });
};