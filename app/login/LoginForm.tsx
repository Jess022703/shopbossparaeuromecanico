"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("PIN incorrecto. Intente de nuevo.");
      setPin("");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-shop-700 bg-shop-900 p-6"
    >
      <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-shop-400">
        PIN de acceso
      </label>
      <input
        type="password"
        inputMode="numeric"
        autoFocus
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full rounded border border-shop-600 bg-shop-950 px-3 py-3 text-center font-mono text-2xl tracking-[0.5em] text-shop-100 outline-none focus:border-guards"
        placeholder="••••"
      />
      {error && (
        <p className="mt-3 text-center text-sm text-guards-light">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || pin.length === 0}
        className="mt-4 w-full rounded bg-guards py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition hover:bg-guards-dark disabled:opacity-40"
      >
        {loading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}
