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
| `/login` | LoginComponent | — |
| `/register` | RegisterComponent | — |
| `/products/:id` | DetailProductComponent | — |
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

### Development

`src/environments/environment.ts`

```ts
export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:8088/api/v1',
};
```

### Production

`src/environments/environment.prod.ts`

```ts
export const environment = {
    production: true,
    apiBaseUrl: 'http://localhost:8099/api/v1',
};
```

## Notes

- Ensure `apiBaseUrl` matches the backend host and port.
- If the backend runs in Docker on host port `8099`, use the production environment.
- The frontend is a standalone app and can be deployed independently.
- The admin panel at `/admin` requires a user with `role_id = 2` (admin).
