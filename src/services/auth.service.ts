import { prisma } from "../utils/prisma";
import type { RegisterRequest } from "../types";
import bcrypt from "bcrypt";
import { FastifyReply } from "fastify";

export const registerUser = async (
  payload: RegisterRequest,
  reply: FastifyReply,
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }],
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      return reply.status(409).send({ message: "Email já está em uso" });
    }
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: "USER",
    },
  });
  const { password, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};
