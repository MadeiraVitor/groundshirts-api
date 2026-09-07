import { FastifyInstance } from "fastify";
import { getProduct, listProducts } from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middleware";

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
}