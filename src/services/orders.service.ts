import { prisma } from "../utils/prisma";
import type { CreateOrder, OrderFilters, UpdateOrder } from "../types";
import Decimal from "decimal.js";
import { OrderStatus } from "../../generated/prisma/client";

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

export async function createOrder(data: CreateOrder) {
  // 1. Buscar todos os produtos para validação
  const productIds = data.items.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  })

  // 2. Validar que todos os produtos existem
  if (products.length !== productIds.length) {
    const foundIds = products.map(p => p.id)
    const missingIds = productIds.filter(id => !foundIds.includes(id))
    throw new Error(`Produto(s) com ID ${missingIds.join(', ')} não encontrado(s)`)
  }

  let total = new Decimal(0)
  const orderItemsData = data.items.map((item) => {
    const product = products.find(product => product.id === item.productId)!

    if (product?.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para o produto ${product.name}`)
    }

    const itemTotal = new Decimal(product.price).mul(item.quantity)
    total = total.add(itemTotal)

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      size: item.size
    }
  })

  const shippingCost = new Decimal(data.shippingCost || 0)
  total = total.add(shippingCost)

  // transação atômica
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: data.userId,
        total,
        status: OrderStatus.PENDING,
        shippingAddress: JSON.parse(JSON.stringify(data.shippingAddress)),
        shippingCost,
        paymentMethod: data.paymentMethod,
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      }
    })

    for (const item of orderItemsData) {
      await tx.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return newOrder
  })

  return order
}

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
