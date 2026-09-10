import type { FastifyInstance } from "fastify";
import {
  createNewOrder,
  deleteExistingOrder,
  getOrder,
  listOrders,
  updateExistingOrder,
} from "../controllers/orders.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Orders"],
        description: "Lista pedidos com filtros opcionais",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", description: "Página" },
            limit: { type: "number", description: "Itens por página" },
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
              description: "Status do pedido",
            },
            userId: { type: "number", description: "ID do usuário" },
            startDate: { type: "string", description: "Data inicial (ISO)" },
            endDate: { type: "string", description: "Data final (ISO)" },
          },
        },
        response: {
          200: {
            description: "Lista paginada de pedidos",
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    userId: { type: "number" },
                    total: { type: "number" },
                    status: { type: "string" },
                    shippingAddress: {
                      type: "object",
                      properties: {
                        cep: { type: "string" },
                        street: { type: "string" },
                        number: { type: "string" },
                        complement: { type: "string" },
                        neighborhood: { type: "string" },
                        city: { type: "string" },
                        state: { type: "string" },
                        country: { type: "string" },
                      },
                    },
                    paymentMethod: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          productId: { type: "number" },
                          price: { type: "number" },
                          quantity: { type: "number" },
                          size: { type: "string" },
                          product: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              name: { type: "string" },
                              price: { type: "number" },
                              slug: { type: "string" },
                              category: {
                                type: "object",
                                properties: {
                                  id: { type: "number" },
                                  name: { type: "string" },
                                  slug: { type: "string" },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              total: { type: "number" },
              page: { type: "number" },
              limit: { type: "number" },
              totalPages: { type: "number" },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    listOrders,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        description: "Cancela um pedido pelo ID",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number", description: "ID do pedido" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Pedido cancelado com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          404: {
            description: "Pedido não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    deleteExistingOrder,
  );

  fastify.put(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        description: "Atualiza status ou endereço de entrega do pedido",
        security: [{ bearerAuth: [] }],
        onRequest: [requireAdmin],
        params: {
          type: "object",
          properties: {
            id: { type: "number", description: "ID do pedido" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
            },
            shippingAddress: {
              type: "object",
              properties: {
                cep: { type: "string" },
                street: { type: "string" },
                number: { type: "string" },
                complement: { type: "string" },
                neighborhood: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                country: { type: "string" },
              },
            },
          },
        },
        response: {
          200: {
            description: "Pedido atualizado com sucesso",
            type: "object",
            properties: {
              id: { type: "number" },
              userId: { type: "number" },
              total: { type: "number" },
              status: { type: "string" },
              shippingAddress: {
                type: "object",
                properties: {
                  cep: { type: "string" },
                  street: { type: "string" },
                  number: { type: "string" },
                  complement: { type: "string" },
                  neighborhood: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  country: { type: "string" },
                },
              },
              paymentMethod: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                },
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    productId: { type: "number" },
                    price: { type: "number" },
                    quantity: { type: "number" },
                    size: { type: "string" },
                    product: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        price: { type: "number" },
                        slug: { type: "string" },
                        category: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            slug: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          404: {
            description: "Pedido não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    updateExistingOrder,
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Orders"],
        description: "Cria um novo pedido",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["items", "shippingAddress", "paymentMethod"],
          properties: {
            userId: { type: "number" },
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "number" },
                  quantity: { type: "number" },
                  size: { type: "string" },
                },
              },
            },
            shippingAddress: {
              type: "object",
              required: [
                "cep",
                "street",
                "number",
                "neighborhood",
                "city",
                "state",
                "country",
              ],
              properties: {
                cep: { type: "string" },
                street: { type: "string" },
                number: { type: "string" },
                complement: { type: "string" },
                neighborhood: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                country: { type: "string" },
              },
            },
            paymentMethod: { type: "string" },
          },
        },
        response: {
          201: {
            description: "Pedido criado com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
              orderId: { type: "number" },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    createNewOrder,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        description: "Obtém um pedido pelo ID",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number", description: "ID do pedido" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Pedido encontrado",
            type: "object",
            properties: {
              id: { type: "number" },
              userId: { type: "number" },
              total: { type: "number" },
              status: { type: "string" },
              shippingAddress: {
                type: "object",
                properties: {
                  cep: { type: "string" },
                  street: { type: "string" },
                  number: { type: "string" },
                  complement: { type: "string" },
                  neighborhood: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  country: { type: "string" },
                },
              },
              paymentMethod: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                },
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    productId: { type: "number" },
                    price: { type: "number" },
                    quantity: { type: "number" },
                    size: { type: "string" },
                    product: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        price: { type: "number" },
                        slug: { type: "string" },
                        category: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            slug: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          404: {
            description: "Pedido não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    getOrder,
  );
}
