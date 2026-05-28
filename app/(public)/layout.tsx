import Link from "next/link";
import { SHOP } from "@/lib/shop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-guards font-mono text-lg font-black text-white">
              E
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold">{SHOP.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">
                {SHOP.tagline}
              </div>
            </div>
          </Link>
          <Link
            href="/guias"
            className="text-sm font-medium text-guards hover:underline"
          >
            Guías
          </Link>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-gray-500">
          <div className="font-semibold text-gray-700">{SHOP.name}</div>
          <div className="mt-1">
            {SHOP.phone} · {SHOP.email}
          </div>
          <div className="mt-0.5">{SHOP.hours}</div>
        </div>
      </footer>
    </div>
  );
}
