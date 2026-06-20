# EuroShop / Euromecanico Corp

MVP funcional en Next.js para administracion de taller europeo/Porsche.

## Comandos

```bash
npm install
npm run seed
npm run dev
npm run build
```

Si npm falla por certificados en esta maquina, el install usado para destrabar fue:

```bash
npm install --offline=false --strict-ssl=false --cache .npm-cache --prefer-online --no-audit --no-fund
```

## Rutas

- `/dashboard`
- `/customers`
- `/vehicles`
- `/repair-orders`
- `/appointments`
- `/inventory`
- `/invoices`
- `/portal/demo-token`
- `/login`

## Incluye

- Next.js App Router + TypeScript.
- UI dark red/gold de Euromecanico Corp.
- Persistencia local en `data/euroshop.json`.
- Prisma schema preparado para PostgreSQL.
- APIs internas para clientes, vehiculos, RO, citas, inventario y facturas.
- VIN decoder en `/api/vehicles/vin-decode?vin=...`.
- Portal demo de cliente.
