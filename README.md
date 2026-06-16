# InterCommerce Web App

SPA de e-commerce desarrollada como prueba técnica, construida con React 19, TypeScript y Vite.

## Tecnologías utilizadas

- **React 19** + **TypeScript** — UI y tipado estricto
- **Vite 6** — bundler y dev server
- **React Router v7** — navegación y rutas dinámicas
- **TanStack Query v5** — fetching, caché, reintentos y estados de servidor
- **Zustand v5** — estado global del carrito con persistencia
- **Axios** — cliente HTTP con instancia base configurada
- **Vitest + React Testing Library** — pruebas de integración
- **API:** [DummyJSON](https://dummyjson.com)

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

## Instalación y ejecución local

```bash
git clone <URL_DEL_REPO>
cd intercommerce
npm install
npm run dev
```

Abrir http://localhost:5173

## Ejecutar pruebas

```bash
npm test
```

## Arquitectura

```
src/
├── services/     # Capa de red: llamadas a la API con axios
├── hooks/        # Lógica de negocio: custom hooks con TanStack Query
├── components/   # UI pura dividida en catalog/, cart/, product/, ui/
├── store/        # Estado global del carrito con Zustand + localStorage
├── pages/        # Páginas: CatalogPage, ProductDetailPage, NotFoundPage
└── types/        # Interfaces TypeScript estrictas, sin any
```

## Requerimientos de la prueba cubiertos

### Módulo A — Catálogo de Productos
- Grid responsivo Mobile First (1/2/3/4 columnas según viewport)
- Skeletons/Shimmers durante la carga
- Paginación con límite de 12 productos por página
- Filtros por texto y categoría con debounce de 400ms
- Sincronización de filtros con URLSearchParams (persistencia por URL)

### Módulo B — Detalle de Producto
- Ruta dinámica `/product/:id`
- Estados de carga, error y éxito
- Galería de imágenes interactiva
- Toast de confirmación al agregar al carrito

### Módulo C — Carrito de Compras
- Drawer lateral con lista de productos
- Cálculo de subtotal, impuestos (16%) y total en capa de negocio
- Persistencia en localStorage (sobrevive al refresco)
- Modal de confirmación de compra

### Ingeniería
- Separación estricta de capas: services / hooks / components
- TypeScript sin `any` en todo el proyecto
- TanStack Query con caché, `staleTime` y `retry` configurados
- Error Boundary global para captura de errores en el árbol React
- `React.memo`, `useCallback` y `useMemo` aplicados donde corresponde
- 5 pruebas de integración: agregar al carrito, incrementar cantidad, calcular total con IVA, eliminar item, vaciar carrito

## Preguntas técnicas

### 1. Hidratación en Next.js (SSR)
Los datos del catálogo se prefetchearían en el servidor con `getServerSideProps` o React Server Components, pasando el estado inicial a TanStack Query via `hydrate(queryClient, dehydrate(...))` para evitar el flash de carga en el cliente.

### 2. Seguridad XSS
Las descripciones se renderizarían con `DOMPurify.sanitize()` antes de usarlas en `dangerouslySetInnerHTML`, nunca insertando HTML crudo directamente. En este proyecto los datos son texto plano, por lo que no se requiere sanitización adicional.

### 3. Escalabilidad del carrito multi-tienda
El store de Zustand se refactorizaría para soportar un mapa de carritos por tienda: `{ [storeId: string]: CartItem[] }`, con acciones que reciban `storeId` como parámetro y una función selectora por tienda para que cada componente solo se suscriba a su carrito relevante.

## Deploy

Desplegado en Vercel: [URL_DEL_DEPLOY]

## Autor

Desarrollado por **Daniel Suárez** — prueba técnica InterCommerce
