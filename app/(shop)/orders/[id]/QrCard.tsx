"use client";

import { SHOP } from "@/lib/shop";

export default function QrCard({
  dataUrl,
  trackUrl,
  vehicle,
}: {
  dataUrl: string;
  trackUrl: string;
  vehicle: string;
}) {
  function printQr() {
    const w = window.open("", "_blank", "width=420,height=560");
    if (!w) return;
    w.document.write(`
      <html><head><title>QR — ${vehicle}</title>
      <style>
        body{font-family:system-ui,sans-serif;text-align:center;padding:32px;color:#171513}
        h1{font-size:18px;margin:0 0 4px} p{margin:2px 0;color:#555;font-size:12px}
        img{width:280px;height:280px;margin:16px 0}
        .url{font-family:monospace;font-size:11px;word-break:break-all;color:#888}
      </style></head>
      <body>
        <h1>${SHOP.name}</h1>
        <p>Escanee para ver el estado de su vehículo</p>
        <p><strong>${vehicle}</strong></p>
        <img src="${dataUrl}" alt="QR" />
        <p class="url">${trackUrl}</p>
        <p>${SHOP.phone} · ${SHOP.hours}</p>
        <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    w.document.close();
  }

  return (
    <div className="rounded-lg border border-shop-800 bg-shop-900 p-4 text-center">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
        Código QR de seguimiento
      </h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="QR de seguimiento"
        className="mx-auto h-44 w-44 rounded bg-white p-2"
      />
      <a
        href={trackUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block break-all font-mono text-[10px] text-shop-500 hover:text-guards-light"
      >
        {trackUrl}
      </a>
      <button
        onClick={printQr}
        className="mt-3 w-full rounded border border-shop-600 py-2 font-mono text-xs text-shop-200 hover:border-guards hover:text-guards-light"
      >
        ⎙ Imprimir QR
      </button>
    </div>
  );
}
