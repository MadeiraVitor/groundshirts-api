import { FastifyInstance } from "fastify";
import { createNewProduct, getProduct, listProducts, updateExistingProduct } from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { CreateProduct, UpdateProduct } from "../types";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);
  
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Lista produtos com filtros opcionais",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", description: "Página" },
            limit: { type: "number", description: "Itens por página" },
            minPrice: { type: "number", description: "Preço mínimo" },
            maxPrice: { type: "number", description: "Preço máximo" },
            search: { type: "string", description: "Busca por nome/descrição" },
            categoryId: { type: "number", description: "ID da categoria" },
            sortBy: {
              type: "string",
              enum: ["price", "name", "createdAt"],
              description: "Campo de ordenação",
            },
            sortOrder: {
              type: "string",
              enum: ["asc", "desc"],
              description: "Ordem",
            },
          },
        },
        response: {
          200: {
            description: "Lista paginada de produtos",
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    price: { type: "number" },
                    createdAt: { type: "string", format: "date-time" },
                    description: { type: "string" },
                    stock: { type: "number" },
                    sizes: {
                      type: "array",
                      items: { type: "string" },
                    },
                    images: {
                      type: "array",
                      items: { type: "string", format: "uri" },
                    },
                    colors: {
                      type: "array",
                      items: { type: "string" },
                    },
                    slug: { type: "string" },
                    active: { type: "boolean" },
                    updatedAt: { type: "string", format: "date-time" },
                    categoryId: { type: "number" },
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
        },
      },
    },
    listProducts,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Obtém um produto pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number", description: "ID do produto" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Produto encontrado",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              price: { type: "number" },
              createdAt: { type: "string" },
              description: { type: "string" },
              stock: { type: "number" },
              sizes: {
                type: "array",
                items: { type: "string" },
              },
              images: {
                type: "array",
                items: { type: "string", format: "uri" },
              },
              colors: {
                type: "array",
                items: { type: "string" },
              },
              slug: { type: "string" },
              active: { type: "boolean" },
              updatedAt: { type: "string" },
              categoryId: { type: "number" },
              category: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  slug: { type: "string" },
                  description: { type: "string" },
                  active: { type: "boolean" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
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
        },
      },
    },
    getProduct,
  );

  fastify.post<{ Body: CreateProduct }>(
    "/",
    {
      // onRequest: [requireAdmin],
      schema: {
        tags: ["Products"],
        description: "Cria um novo produto",
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "number" },
            sizes: {
              type: "array",
              items: { type: "string" },
            },
            images: {
              type: "array",
              items: { type: "string" },
            },
            colors: {
              type: "array",
              items: { type: "string" },
            },
            active: { type: "boolean" },
            categoryId: { type: "number" },
          },
          required: [
            "name",
            "description",
            "price",
            "categoryId",
          ],
        },
        response: {
          201: {
            description: "Produto criado com sucesso",
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
    createNewProduct,
  );

  fastify.put<{ Params: { id: string }; Body: UpdateProduct }>(
    "/:id",
    {
      // onRequest: [requireAdmin],
      schema: {
        tags: ["Products"],
        description: "Atualiza um produto pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID do produto" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            active: { type: "boolean" },
            stock: { type: "number" },
            categoryId: { type: "number" },
            colors: {
              type: "array",
              items: { type: "string" },
            },
            images: {
              type: "array",
              items: { type: "string" },
            },
            sizes: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        response: {
          200: {
            description: "Produto atualizado com sucesso",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              price: { type: "number" },
              createdAt: { type: "string" },
              description: { type: "string" },
              stock: { type: "number" },
              sizes: {
                type: "array",
                items: { type: "string" },
              },
              images: {
                type: "array",
                items: { type: "string", format: "uri" },
              },
              colors: {
                type: "array",
                items: { type: "string" },
              },
              slug: { type: "string" },
              active: { type: "boolean" },
              updatedAt: { type: "string" },
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
            description: "Produto não encontrado",
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
    updateExistingProduct,
  );
}