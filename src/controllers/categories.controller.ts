import type { FastifyReply, FastifyRequest } from "fastify";
import type { CategoryFilters, CreateCategory, UpdateCategory } from "../types";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/categories.service";
import {
  categoryFiltersSchema,
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../utils/validators";
import { generateSlug } from "../utils/slug";

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

export const createNewCategory = async (
  request: FastifyRequest<{ Body: CreateCategory }>,
  reply: FastifyReply,
) => {
  const body = request.body;

  body.slug = generateSlug(body.name);

  const validate = createCategorySchema.parse(body);

  await createCategory(validate);

  reply.status(201).send({ message: "Categoria criada com sucesso" });
};

export const updateExistingCategory = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateCategory }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const body = request.body;

  const validate = updateCategorySchema.parse(body);

  if (validate.name) {
    validate.slug = generateSlug(validate.name);
  }

  const category = await updateCategory(Number(id), validate);

  reply.status(200).send(category);
};

export const deleteExistingCategory = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const validate = deleteCategorySchema.parse({ id: Number(id) });

  await deleteCategory(validate.id);

  reply.status(200).send({ message: "Categoria desativada com sucesso" });
};
