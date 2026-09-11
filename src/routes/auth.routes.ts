import type { FastifyInstance } from "fastify";
import {
  login,
  register,
  profile,
  signOut,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        description: "Registrar um novo usuário",
        body: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", description: "João Silva" },
            email: {
              type: "string",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              description: "Senha do usuário",
            },
          },
        },
      },
    },
    register,
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "Autentica um usuário e retorna um token JWT",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              description: "Senha do usuário",
            },
          },
        },
      },
    },
    login,
  );

  fastify.get(
    "/profile",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        description: "Retorna o perfil do usuário autenticado",
        security: [{ bearerAuth: [] }],
      },
    },
    profile,
  );

  fastify.post(
    "/signout",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        description: "Faz logout do usuário removendo o cookie JWT",
        security: [{ bearerAuth: [] }],
      },
    },
    signOut,
  );
}
