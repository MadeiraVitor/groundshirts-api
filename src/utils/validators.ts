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
  categoryId: z.coerce.number().int().min(1, "CategoryId é obrigatório").optional(),
  sortBy: z.enum(["price", "name", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
