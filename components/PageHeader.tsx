export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between border-b border-shop-800 px-6 py-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-shop-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-shop-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
