import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
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

export const categoryFiltersSchema = z.object({
  page: z.coerce.number().int().min(1, "Page deve ser >= 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit deve ser >= 1").optional(),
  search: z.string().trim().min(1, "Search não pode ser vazio").optional(),
});

export const orderFiltersSchema = z.object({
  page: z.coerce.number().int().min(1, "Page deve ser >= 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit deve ser >= 1").optional(),
  status: z
    .enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  userId: z.coerce.number().int().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const shippingAddressSchema = z.object({
  cep: z.string().regex(/^\d{8}$/, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  country: z.string().default("BR"),
});

export const createOrderItemSchema = z.object({
  productId: z.number().int().min(1, "ID do produto inválido"),
  quantity: z.number().int().min(1, "Quantidade deve ser no mínimo 1"),
  size: z.string().optional(),
});

export const createOrderSchema = z.object({
  userId: z.number().int().optional(),
  items: z
    .array(createOrderItemSchema)
    .min(1, "Pedido deve ter pelo menos um item"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  shippingAddress: shippingAddressSchema.optional(),
});

export const deleteOrderSchema = z.object({
  id: z.number().int().min(1, "ID é obrigatório"),
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
