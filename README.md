# compia-bookstore-app

Frontend da COMPIA Bookstore. React 18 + TypeScript + Vite + Shadcn/UI.

> **API:** Este repo depende do [compia-bookstore-api](https://github.com/seu-usuario/compia-bookstore-api) rodando.

## Stack

| Tecnologia      | Função                    |
|-----------------|---------------------------|
| React 18        | UI                        |
| TypeScript      | Tipagem                   |
| Vite            | Build / Dev server        |
| Shadcn/UI       | Componentes               |
| TailwindCSS     | Estilização               |
| TanStack Query  | Cache / fetching de dados |
| React Hook Form | Formulários               |
| Zod             | Validação                 |
| Framer Motion   | Animações                 |

---

## Configuração

```bash
cp .env.local.example .env.local
# edite VITE_API_URL para apontar pro backend
```

---

## Rodar localmente (sem Docker)

```bash
npm install
npm run dev     # http://localhost:5173
```

> A API precisa estar rodando em `VITE_API_URL` (padrão: `http://localhost:3333`).

## Rodar com Docker

```bash
# Desenvolvimento (hot reload)
docker compose -f docker-compose.dev.yml up

# Produção (build estático com Nginx)
VITE_API_URL=http://sua-api.com docker compose up --build
```

---

## Estrutura relevante

```
src/
├── lib/
│   └── api.ts                    ← cliente HTTP tipado para a API
├── hooks/
│   └── queries/
│       ├── useProducts.ts        ← hooks TanStack Query para produtos
│       ├── useOrders.ts          ← hooks TanStack Query para pedidos
│       └── useStats.ts           ← hook para métricas do dashboard
├── context/
│   └── CartContext.tsx           ← carrinho (estado local)
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── CatalogManagement.tsx
│   │   └── OrderManagement.tsx
│   └── ...
└── data/
    └── products.ts               ← (legado) substituir pelos hooks
```

---

## Integrando com a API

### Trocar mock de produtos

```tsx
// Antes
import { products } from "@/data/products";

// Depois
import { useProducts } from "@/hooks/queries/useProducts";

const { data: products, isLoading, isError } = useProducts();
```

### Filtros

```tsx
const { data } = useProducts({ category: "Inteligencia_Artificial", format: "Ebook" });
const { data } = useProducts({ search: "deep learning" });
```

### Checkout

```tsx
import { useCreateOrder } from "@/hooks/queries/useOrders";
import { useCart } from "@/context/CartContext";

const { mutate: createOrder, isPending } = useCreateOrder();
const { items, clearCart } = useCart();

function handleCheckout(customerName: string, customerEmail: string) {
  createOrder(
    {
      customerName,
      customerEmail,
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    },
    { onSuccess: () => clearCart() }
  );
}
```

### Dashboard admin

```tsx
import { useStats } from "@/hooks/queries/useStats";

const { data: stats } = useStats();
// stats.totalProducts, stats.ordersThisMonth, stats.revenueThisMonth, stats.growth
```

---

## Variáveis de ambiente

| Variável       | Padrão                    | Descrição                    |
|----------------|---------------------------|------------------------------|
| VITE_API_URL   | http://localhost:3333     | URL base da API REST         |
