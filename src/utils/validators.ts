import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const productFiltersSchema = z.object({
  page: z.coerce.number().int().min(1, "Page deve ser >= 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit deve ser >= 1").optional(),
  minPrice: z.coerce.number().min(0, "MinPrice deve ser >= 0").optional(),
  maxPrice: z.coerce.number().min(0, "MaxPrice deve ser >= 0").optional(),
  search: z.string().trim().min(1, "Search não pode ser vazio").optional(),
  categoryId: z.coerce
    .number()
    .int()
    .min(1, "CategoryId é obrigatório")
    .optional(),
  sortBy: z.enum(["price", "name", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(0, "Price deve ser >= 0"),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  slug: z.string().min(1, "Slug é obrigatório"),
  stock: z.coerce.number().int().min(0, "Stock deve ser >= 0"),
  active: z.boolean(),
  images: z.array(z.string()).default([]),
  categoryId: z.coerce.number().int().min(1, "CategoryId é obrigatório"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price deve ser >= 0").optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  slug: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock deve ser >= 0").optional(),
  active: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.coerce.number().int().optional(),
});

export const deleteProductSchema = z.object({
  id: z.number().int().min(1, "ID é obrigatório"),
});

export const categoryFiltersSchema = z.object({
  page: z.coerce.number().int().min(1, "Page deve ser >= 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit deve ser >= 1").optional(),
  search: z.string().trim().min(1, "Search não pode ser vazio").optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug é obrigatório"),
  active: z.boolean(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.number().int().min(1, "ID é obrigatório"),
});
