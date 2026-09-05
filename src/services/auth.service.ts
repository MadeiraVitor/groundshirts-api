import { prisma } from "../utils/prisma";
import type { AuthRequest, RegisterRequest } from "../types";
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

export const loginUser = async (data: AuthRequest) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw new Error("Senha incorreta");
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
