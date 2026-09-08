import type { FastifyReply, FastifyRequest } from "fastify";
import type { CategoryFilters } from "../types";
import {
  getCategories,
  getCategoryById,
} from "../services/categories.service";
import {
  categoryFiltersSchema,
} from "../utils/validators";

export const listCategories = async (
  request: FastifyRequest<{ Querystring: CategoryFilters }>,
  reply: FastifyReply,
) => {
  const filters = categoryFiltersSchema.parse(request.query);
  const result = await getCategories(filters as CategoryFilters);
  reply.send(result);
};

export const getCategory = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const category = await getCategoryById(Number(request.params.id));
  reply.status(200).send(category);
};