export type Route =
  | "home"
  | "servicios"
  | "nosotros"
  | "insights"
  | "contacto"
  | "faq";

export const ROUTES: Route[] = ["home", "servicios", "nosotros", "insights", "contacto", "faq"];

export type RouteMatch = { route: Route; param?: string };

/**
 * Interpreta hashes tipo `#/servicios`, `#/contacto/trabajo`.
 * Lo que no coincide con una ruta conocida cae en "home".
 */
export function parseHash(): RouteMatch {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  const parts = raw.split("/").filter(Boolean);
  const head = (parts[0] ?? "").trim().toLowerCase();
  const route = (ROUTES.find((r) => r === head) ?? "home") as Route;
  const param = parts[1] ? decodeURIComponent(parts[1].toLowerCase()) : undefined;
  return { route, param };
}

export function routeFromHash(): Route {
  return parseHash().route;
}

export const ROUTE_META: Record<Route, { title: string; label: string }> = {
  home: { title: "Inicio", label: "Inicio" },
  servicios: { title: "Servicios", label: "Servicios" },
  nosotros: { title: "Nosotros", label: "Nosotros" },
  insights: { title: "Insights", label: "Insights" },
  contacto: { title: "Contacto", label: "Contacto" },
  faq: { title: "FAQ", label: "FAQ" },
};
