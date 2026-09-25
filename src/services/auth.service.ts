import { FastifyReply } from "fastify";
import type { AuthRequest, RegisterRequest } from "../types";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (data: AuthRequest, reply: FastifyReply) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    reply.status(409).send({ message: "As credenciais estão incorretas" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    reply.status(409).send({ message: "As credenciais estão incorretas" });
    return;
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
