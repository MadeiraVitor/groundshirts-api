import { prisma } from "../utils/prisma";
import type { CreateOrder, OrderFilters, UpdateOrder } from "../types";

export const getOrders = async (filters: OrderFilters) => {
  const { status, userId, startDate, endDate, page = 1, limit = 10 } = filters;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (userId) {
    where.userId = userId;
  }

  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }

    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
};

export const getOrderById = async (
  id: number,
  requestingUserId: number,
  isAdmin: boolean,
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (!isAdmin && (!order.userId || order.userId !== requestingUserId)) {
    throw new Error("Você não tem permissão para acessar este pedido");
  }

  return order;
};

export const createOrder = async (data: CreateOrder) => {
  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  const productById = new Map(products.map((product) => [product.id, product]));

  const itemsWithSnapshot = data.items.map((item) => {
    const product = productById.get(item.productId);

    if (!product) {
      throw new Error(`Produto com ID ${item.productId} não encontrado`);
    }

    if (!product.active) {
      throw new Error(`Produto ${product.name} está inativo`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, solicitado: ${item.quantity}`,
      );
    }

    const sizes = Array.isArray(product.sizes)
      ? (product.sizes as string[])
      : [];

    if (sizes.length > 0 && !item.size) {
      throw new Error(`Produto ${product.name} requer seleção de tamanho`);
    }

    if (item.size && sizes.length > 0 && !sizes.includes(item.size)) {
      throw new Error(
        `Tamanho ${item.size} não disponível para ${product.name}`,
      );
    }

    return {
      item,
      priceSnapshot: Number(product.price),
    };
  });

  const total = itemsWithSnapshot.reduce(
    (sum, current) => sum + current.priceSnapshot * current.item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: data.userId,
        total,
        status: "PENDING",
        shippingAddress: data.shippingAddress as any,
        paymentMethod: data.paymentMethod,
      },
    });

    await Promise.all(
      itemsWithSnapshot.map(({ item, priceSnapshot }) =>
        tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            price: priceSnapshot,
            quantity: item.quantity,
            size: item.size,
          },
        }),
      ),
    );

    await Promise.all(
      itemsWithSnapshot.map(({ item }) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    return newOrder;
  });

  return order;
};

export const updateOrder = async (
  id: number,
  data: UpdateOrder,
  requestingUserId: number,
  isAdmin: boolean,
) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Pedido não encontrado");
  }

  if (
    !isAdmin &&
    (!existingOrder.userId || existingOrder.userId !== requestingUserId)
  ) {
    throw new Error("Você não tem permissão para acessar este pedido");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: data.status,
      shippingAddress: data.shippingAddress
        ? (data.shippingAddress as any)
        : undefined,
    },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return updatedOrder;
};

export const deleteOrder = async (
  id: number,
  requestingUserId: number,
  isAdmin: boolean,
) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Pedido não encontrado");
  }

  if (
    !isAdmin &&
    (!existingOrder.userId || existingOrder.userId !== requestingUserId)
  ) {
    throw new Error("Você não tem permissão para acessar este pedido");
  }

  await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};
