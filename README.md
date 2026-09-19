<h1 align="center">
  GroundShirts API
</h1>

API para o e-commerce GroundShirts usando Node.js, TypeScript, Fastify, Prisma e PostgreSQL + Supabase.

---

## 📄 Descrição

API de e-commerce feita com Node.js, TypeScript, Fastify e Prisma, com persistência em PostgreSQL + Supabase. Possui documentação (Scalar + Swagger) e endpoints para autenticação, produtos, categorias e pedidos.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL + Supabase
- JWT
- Scalar + Swagger
- Zod
- Vitest

---

## ⚙️ Funcionalidades

- Autenticação com registro/login e JWT
- CRUD de produtos e categorias com desativação (soft delete)
- CRUD de pedidos
- Documentação interativa em /docs

---

## ▶️ Como rodar o projeto

1. Clone o repositório:

```
git clone https://github.com/MadeiraVitor/groundshirts-api
```

2. Instale as dependências:

```
npm install
```

3. Tenha um PostgreSQL disponível (local ou remoto):

```
# Use sua instancia PostgreSQL preferida
```

4. Crie um arquivo `.env` na raiz com as variáveis `DATABASE_URL` e `JWT_SECRET`. Exemplo:

```
DATABASE_URL=postgresql://user:password@localhost:5432/db-name?schema=public
JWT_SECRET=sua-chave-secreta
```

5. Rode as migrações do Prisma e gere o client:

```
npm run prisma:migrate
npx prisma generate
```

6. Inicie o servidor em modo desenvolvimento:

```
npm run dev
```

Servidor: `http://localhost:3000`

Scalar: `http://localhost:3000/docs`

## 📌 Endpoints

- `POST /auth/register`
  - Cria um novo usuário.
  - Corpo JSON esperado:

```
{
  "firstName": "Joao",
  "lastName": "Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

- `POST /auth/login`
  - Autentica o usuário e retorna um token JWT.

- `GET /products`
  - Lista produtos com filtros opcionais.

- `GET /products/:id`
  - Obtém um produto pelo ID.

- `POST /products`
  - Cria um novo produto (admin).

- `PUT /products/:id`
  - Atualiza um produto pelo ID (admin).

- `DELETE /products/:id`
  - Desativa um produto pelo ID (admin).

- `GET /categories`
  - Lista categorias com filtros opcionais.

- `GET /categories/:id`
  - Obtém uma categoria pelo ID.

- `POST /categories`
  - Cria uma nova categoria (admin).

- `PUT /categories/:id`
  - Atualiza uma categoria pelo ID (admin).

- `DELETE /categories/:id`
  - Desativa uma categoria pelo ID (admin).

- `GET /orders`
  - Lista pedidos com filtros opcionais.

- `GET /orders/:id`
  - Obtém um pedido pelo ID.

- `POST /orders`
  - Cria um novo pedido.

- `PUT /orders/:id`
  - Atualiza status ou endereco de entrega (admin).

- `DELETE /orders/:id`
  - Cancela um pedido pelo ID.

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foi possível praticar:

- Estruturação de API REST com Fastify
- Uso do Prisma com adaptador para PostgreSQL
- Configuração de variáveis de ambiente com dotenv
- Documentação de API com Swagger
- Testes com Vitest (unitario e cobertura)

## 👤 Autor

<div align="center">
    <p>Desenvolvido por <strong>Vitor Madeira</strong></p>
    <a href="https://www.linkedin.com/in/vitor-madeira/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a>
    <a href = "mailto:vitorsoutom@hotmail.com"><img src="https://img.shields.io/badge/-Email-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
</div>