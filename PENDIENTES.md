# Lista por hacer — ShopBoss / Euromecanico Corp

Funciones detectadas comparando este repo con otras copias de ShopBoss
(principalmente `SilverX261/shopboss`) que aún faltan aquí.

## Prioridad alta
- [ ] **PDF de facturas y estimados** — generar PDF imprimible (ej. `@react-pdf/renderer`). Hoy solo hay exportación a Excel.
- [ ] **Reportes con gráficas** — página `/reports` con ingresos, órdenes por estado y tendencias (ej. `recharts`).
- [ ] **Proveedores / cuentas por pagar** — modelo `Supplier` + compras de piezas (Worldpac, SSF, AutoZone Pro).
- [ ] **Empleados/mecánicos con roles + bitácora** — asignar órdenes por mecánico y registrar quién hizo qué (activity log).

## Prioridad media
- [ ] **WhatsApp integrado** — reutilizar el flujo de recordatorios/comunicaciones para enviar por WhatsApp (además del SMS actual).
- [ ] **Reset de contraseña + verificación de email** — hoy solo hay login/logout.
- [ ] **Página de Settings real + onboarding** — configurar taller (impuestos, datos fiscales, usuarios).
- [ ] **Punto de venta / caja diaria** — abrir/cerrar caja, registrar gastos y arqueo del día.

## Prioridad baja / mejoras
- [ ] **Notificaciones push + PWA** — app instalable en móvil (`web-push`, `next-pwa`).
- [ ] **Escaneo de código de barras/QR** — inventario más rápido (`html5-qrcode`).
- [ ] **Cuentas de crédito/fiado con aprobación** — clientes con crédito y flujo de aprobación.
- [ ] **Tests automatizados** — cobertura con Playwright (el repo no tiene tests).

---
_Generado a partir de la comparación con las copias en `programacion/copiashopboss/`._
