"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SHOP } from "@/lib/shop";

const LINKS = [
  { href: "/dashboard", label: "Panel", icon: "▣" },
  { href: "/orders", label: "Órdenes", icon: "▤" },
  { href: "/vehicles", label: "Vehículos", icon: "▦" },
  { href: "/inventory", label: "Inventario", icon: "▥" },
  { href: "/guides", label: "Guías", icon: "▧" },
];

export default function ShopNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="flex w-52 shrink-0 flex-col border-r border-shop-800 bg-shop-900">
      <div className="border-b border-shop-800 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-guards font-mono text-lg font-black text-white">
            E
          </span>
          <div className="leading-tight">
            <div className="font-mono text-sm font-bold">Euromecanico</div>
            <div className="text-[10px] uppercase tracking-widest text-shop-500">
              Taller
            </div>
          </div>
        </div>
      </div>

      <ul className="flex-1 space-y-0.5 p-2">
        {LINKS.map((l) => {
          const active =
            pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`flex items-center gap-3 rounded px-3 py-2 font-mono text-sm transition ${
                  active
                    ? "bg-guards/15 text-guards-light"
                    : "text-shop-300 hover:bg-shop-800 hover:text-shop-100"
                }`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-shop-800 p-3">
        <Link
          href="/orders/new"
          className="mb-2 block rounded bg-guards px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-guards-dark"
        >
          + Nueva Orden
        </Link>
        <div className="px-1 text-[10px] leading-relaxed text-shop-500">
          {SHOP.phone}
          <br />
          {SHOP.hours}
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full rounded px-3 py-1.5 text-left font-mono text-xs text-shop-400 hover:bg-shop-800 hover:text-shop-200"
        >
          ⟲ Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
