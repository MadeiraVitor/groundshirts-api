import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateOrder, OrderFilters, UpdateOrder } from "../types";
import { prisma } from "../utils/prisma";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../services/orders.service";
import {
  createOrderSchema,
  deleteOrderSchema,
  orderFiltersSchema,
  updateOrderSchema,
} from "../utils/validators";

type JwtPayload = {
  userId?: number;
};

const getUserContext = async (request: FastifyRequest) => {
  const payload = (request as FastifyRequest & { user?: JwtPayload }).user;
  const userId = payload?.userId;

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return {
    userId,
    isAdmin: user?.role === "ADMIN",
  };
};

export const listOrders = async (
  request: FastifyRequest<{ Querystring: OrderFilters }>,
  reply: FastifyReply,
) => {
  const filters = orderFiltersSchema.parse(request.query);
  const { userId, isAdmin } = await getUserContext(request);
  const effectiveFilters: OrderFilters = {
    ...filters,
    userId: isAdmin ? filters.userId : userId,
  };
  const result = await getOrders(effectiveFilters);
  reply.send(result);
};

export const getOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { userId, isAdmin } = await getUserContext(request);
  const order = await getOrderById(Number(request.params.id), userId, isAdmin);
  reply.status(200).send(order);
};

export const createNewOrder = async (
  request: FastifyRequest<{ Body: CreateOrder }>,
  reply: FastifyReply,
) => {
  const body = request.body;
  const validate = createOrderSchema.parse(body);
  const order = await createOrder(validate);

  reply
    .status(201)
    .send({ message: "Pedido criado com sucesso", orderId: order.id });
};

export const updateExistingOrder = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateOrder }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const body = request.body;
  const validate = updateOrderSchema.parse(body);

  const { userId, isAdmin } = await getUserContext(request);
  const order = await updateOrder(Number(id), validate, userId, isAdmin);

  reply.status(200).send(order);
};

export const deleteExistingOrder = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const validate = deleteOrderSchema.parse({ id });

  const { userId, isAdmin } = await getUserContext(request);
  await deleteOrder(validate.id, userId, isAdmin);

  reply.status(200).send({ message: "Pedido cancelado com sucesso" });
};
