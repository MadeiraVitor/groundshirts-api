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
- Integração com Stripe Checkout para pagamentos com cartão
- Webhook do Stripe para atualizar automaticamente o status do pedido
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

4. Crie um arquivo `.env` na raiz com as variáveis `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET_KEY`. Exemplo:

```
DATABASE_URL=postgresql://user:password@localhost:5432/db-name?schema=public
JWT_SECRET=sua-chave-secreta
STRIPE_SECRET_KEY=sua-chave-secreta-do-stripe
STRIPE_WEBHOOK_SECRET_KEY=seu-segredo-do-webhook-do-stripe
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

### Stripe

O checkout cria o pedido na API e, em seguida, cria uma sessão do Stripe Checkout
com os itens do pedido em reais (BRL). Atualmente, o checkout aceita pagamentos
com cartão e retorna o `sessionId` que deve ser usado pelo frontend para abrir a
página de pagamento do Stripe.

O Stripe deve enviar os eventos para `POST /stripe/webhook`. A API valida a
assinatura usando `STRIPE_WEBHOOK_SECRET_KEY` e atualiza o pedido relacionado
ao evento:

- `checkout.session.completed`: altera o status do pedido para `PAID`.
- `charge.failed`: altera o status do pedido para `CANCELLED`.

Para o webhook funcionar, configure no Stripe a URL pública
`https://seu-dominio.com/stripe/webhook` e informe o segredo de assinatura no
arquivo `.env`. Em desenvolvimento, use o Stripe CLI para
encaminhar os eventos para o servidor local.

## 📌 Endpoints

- `POST /auth/register`
  - Cria um novo usuário.
  - Corpo JSON esperado:

```
{
  "fullName": "Joao Silva",
  "email": "joao@email.com",
  "password": "12345678"
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

- `POST /stripe/checkout`
  - Cria um pedido e uma sessão de pagamento no Stripe Checkout.
  - Retorna `{ "sessionId": "..." }`.
  - Corpo JSON esperado:

```
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": {
    "cep": "01001000",
    "street": "Praca da Se",
    "number": 1,
    "complement": "Apto 10",
    "neighborhood": "Se",
    "city": "Sao Paulo",
    "state": "SP"
  },
  "paymentMethod": "credit_card",
  "shippingCost": 15
}
```

- `userId` é opcional para checkout de convidado.
- `size` é opcional quando o produto nao possui tamanhos.

- `POST /stripe/webhook`
  - Recebe eventos do Stripe e exige o cabecalho `stripe-signature`.
  - Deve receber o corpo bruto da requisição para que a assinatura seja validada.

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
