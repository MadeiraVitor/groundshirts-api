import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";

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
}