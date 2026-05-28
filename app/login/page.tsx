import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { SHOP } from "@/lib/shop";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center bg-shop-950 px-4 font-sans text-shop-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded bg-guards font-mono text-2xl font-black text-white">
            E
          </div>
          <h1 className="font-mono text-xl font-bold tracking-tight">
            {SHOP.name}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-shop-400">
            {SHOP.tagline}
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
