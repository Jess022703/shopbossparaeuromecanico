export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-PR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    IN_PROGRESS: "En proceso",
    WAITING_PARTS: "Esperando partes",
    QUALITY_CHECK: "DVI",
    READY: "Lista",
    COMPLETED: "Completada",
    INVOICED: "Facturada",
    PAID: "Pagada",
    CONFIRMED: "Confirmada",
    CANCELLED: "Cancelada"
  };

  return labels[status] ?? status;
}

export function priorityLabel(priority: string) {
  const labels: Record<string, string> = {
    HIGH: "Alta",
    MEDIUM: "Media",
    LOW: "Baja"
  };

  return labels[priority] ?? priority;
}
