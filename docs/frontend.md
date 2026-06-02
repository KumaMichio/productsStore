# Frontend Documentation

## Location

`frontend`

## Technology stack

- Angular 17
- Angular SSR (`@angular/ssr`)
- Bootstrap 5
- Font Awesome
- `@auth0/angular-jwt`
- RxJS
- Express for SSR server
- Google Fonts: Cormorant Garamond (serif), DM Sans (sans-serif)

## Design system

The frontend follows a **Maison Sand**-inspired aesthetic:

| Token | Value | Usage |
|---|---|---|
| `$color-bg` | `#F8F5F0` | Page background |
| `$color-bg-alt` | `#F0EBE3` | Cards, footer, search bar |
| `$color-text` | `#1C1A16` | Primary text |
| `$color-muted` | `#7A6E64` | Secondary text, labels |
| `$color-border` | `#E2D9CE` | Dividers, input borders |
| `$color-accent` | `#3D2E20` | Buttons, active states |
| `$font-serif` | Cormorant Garamond | Headings, brand |
| `$font-sans` | DM Sans | Body, UI elements |

Design tokens are defined in `src/app/styles/shared-styles.scss`.

## Important files

- `package.json` — dependencies and scripts
- `angular.json` — Angular workspace configuration
- `tsconfig.json` — TypeScript config
- `src/styles.scss` — global styles (imports design system)
- `src/app/styles/shared-styles.scss` — design tokens (SCSS variables)
- `src/environments/environment.ts` — development API URL
- `src/environments/environment.prod.ts` — production API URL

## Build and run

### Install dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict between
> `@ng-bootstrap/ng-bootstrap@16` (requires Angular 17.3.x) and the project's
> Angular 17.0.x.

### Development server

```bash
npm run start:dev
```

Runs on port `4300`.

### Build

```bash
npm run build
```

### Production build

```bash
npm run build:production
```

### SSR serve

```bash
npm run serve:ssr:shopapp-angular
```

## Routing

| Path | Component | Guard |
|---|---|---|
| `/` | HomeComponent | — |
| `/` `?search=` / `?category=` | HomeComponent (filtered grid) | — |
| `/login` | LoginComponent | — |
| `/register` | RegisterComponent | — |
| `/products/:id` | DetailProductComponent | — |
| `/contact` | ContactComponent (form → `POST /contacts`) | — |
| `/page/:slug` | InfoPageComponent (static content) | — |
| `/orders` | OrderComponent | AuthGuard |
| `/orders/:id` | OrderDetailComponent | — |
| `/user-profile` | UserProfileComponent | AuthGuard |
| `/admin` | AdminComponent | AdminGuard |
| `/admin/orders` | OrderAdminComponent | AdminGuard |
| `/admin/orders/:id` | DetailOrderAdminComponent | AdminGuard |
| `/admin/products` | ProductAdminComponent | AdminGuard |
| `/admin/products/insert` | InsertProductAdminComponent | AdminGuard |
| `/admin/products/update/:id` | UpdateProductAdminComponent | AdminGuard |
| `/admin/categories` | CategoryAdminComponent | AdminGuard |
| `/admin/categories/insert` | InsertCategoryAdminComponent | AdminGuard |
| `/admin/categories/update/:id` | UpdateCategoryAdminComponent | AdminGuard |
| `/admin/users` | UserAdminComponent | AdminGuard |

## API configuration

`ng serve` uses `environment.development.ts` (via the build `development` fileReplacement); a plain build uses `environment.ts`.

### Development

`src/environments/environment.development.ts` and `src/environments/environment.ts`

```ts
export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:8099/api/v1',
};
```

> Port `8099` matches the backend running in Docker (`deployment.yaml` maps host `8099` → container `8088`). If you run the backend locally with `mvn spring-boot:run` instead, change this to `8088`.

### Production

`src/environments/environment.prod.ts`

```ts
export const environment = {
    production: true,
    apiBaseUrl: 'https://KOYEB_APP_URL/api/v1',
};
```

Replace `KOYEB_APP_URL` with the deployed backend host.

## SSR in development

The app is configured with Angular SSR (`server` / `prerender` / `ssr` in `angular.json` build options) for production. **SSR is disabled for the dev server** (`"ssr": false, "prerender": false` in the build `development` configuration) because SSR rendering stalls ~58s per page during `ng serve` (the app does not reach Angular stability on the server). Production builds keep SSR. To test SSR locally: `ng serve --configuration production`.

## Search

The header has a search box (magnifier icon → input). Submitting navigates to `/` with a `?search=<keyword>` query param; `HomeComponent` subscribes to `queryParamMap` and filters the product grid via `GET /products?keyword=...`. There is no separate search-results page — results render in the home product grid.

## Footer & nav links

All footer and top-nav links are wired:

| Group | Link | Destination |
|---|---|---|
| Footer SHOP | `Mới nhất` | `/` (all products) |
| Footer SHOP | category names (dynamic, first 4 from API) | `/?category=<id>` (filtered grid) |
| Footer STUDIO | Về chúng tôi / Blog / Đại lý / Báo chí | `/page/about` · `/page/blog` · `/page/stockists` · `/page/press` |
| Footer HỖ TRỢ | Vận chuyển / Đổi trả / Liên hệ / Hướng dẫn bảo quản | `/page/shipping` · `/page/returns` · `/contact` · `/page/care` |
| Top nav | Journal / About | `/page/blog` · `/page/about` |

Static content pages are served by a single `InfoPageComponent` keyed by `:slug` (content map inside the component). `Liên hệ` and the home newsletter form post to the backend (`/contacts`, `/newsletter/subscribe`).

## Feature status

Implemented and wired to the backend:

- Product listing + pagination + category tabs/filter (home)
- **Product search** (header → home grid, by keyword)
- **Category filter via footer** (`?category=<id>`)
- Product detail view
- Add to cart (localStorage) with toast + header cart-count badge
- Checkout / place order, coupon apply
- Login / register / user profile
- **Contact form** → `POST /contacts`
- **Newsletter subscribe** (home + footer) → `POST /newsletter/subscribe`
- Static content pages (About, Blog, Stockists, Press, Shipping, Returns, Care) via `/page/:slug`
- Admin CRUD: products (incl. image upload), categories, orders, users

Remaining cosmetic placeholders (intentional, low priority):

| Location | Element | Status |
|---|---|---|
| Home | Bento card category labels (`Apparel`, `Beauty`, …) | hardcoded display text, not bound to real categories |
| Info pages | Blog / Press content | static placeholder copy (no CMS/backend) |

## Notes

- Ensure `apiBaseUrl` matches the backend host and port.
- If the backend runs in Docker on host port `8099`, the dev environment already targets it.
- The frontend is a standalone app and can be deployed independently.
- The admin panel at `/admin` requires a user with `role_id = 2` (admin).
