export const PRIMARY = "#2563EB"; // blue-600
export const SECONDARY = "#F97316"; // orange-500

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-MX").format(n);
}

export function formatPercent(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
