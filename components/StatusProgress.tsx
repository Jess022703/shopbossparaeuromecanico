import {
  ORDER_STATUSES,
  OrderStatus,
  STATUS_META,
  isOrderStatus,
} from "@/lib/constants";

// Visual progress bar across the status flow. `light` mode is used on the
// client tracking page; default (dark) is for the shop.
export default function StatusProgress({
  status,
  light = false,
}: {
  status: string;
  light?: boolean;
}) {
  const currentStep = isOrderStatus(status)
    ? STATUS_META[status as OrderStatus].step
    : 0;

  return (
    <ol className="flex w-full items-start justify-between gap-1">
      {ORDER_STATUSES.map((s, idx) => {
        const meta = STATUS_META[s];
        const isDone = meta.step < currentStep;
        const isCurrent = meta.step === currentStep;
        const dotBase =
          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-mono font-bold transition-colors";
        let dotClass: string;
        if (isCurrent) {
          dotClass = "border-guards bg-guards text-white";
        } else if (isDone) {
          dotClass = light
            ? "border-guards bg-guards/15 text-guards"
            : "border-guards/70 bg-guards/20 text-guards-light";
        } else {
          dotClass = light
            ? "border-gray-300 bg-white text-gray-400"
            : "border-shop-600 bg-shop-800 text-shop-500";
        }
        return (
          <li
            key={s}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {idx < ORDER_STATUSES.length - 1 && (
              <span
                className={`absolute left-1/2 top-4 -z-0 h-0.5 w-full ${
                  isDone
                    ? "bg-guards/60"
                    : light
                      ? "bg-gray-200"
                      : "bg-shop-700"
                }`}
              />
            )}
            <span className={`relative z-10 ${dotClass}`}>{meta.step}</span>
            <span
              className={`mt-1.5 text-[10px] leading-tight ${
                isCurrent
                  ? light
                    ? "font-semibold text-guards"
                    : "font-semibold text-guards-light"
                  : light
                    ? "text-gray-500"
                    : "text-shop-400"
              }`}
            >
              {meta.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
