import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Car, ClipboardList, FileText, Gauge, Mail, Package, Settings, Users, Wrench } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/vehicles", label: "Vehiculos", icon: Car },
  { href: "/repair-orders", label: "Ordenes / RO", icon: Wrench },
  { href: "/appointments", label: "Citas", icon: CalendarDays },
  { href: "/inventory", label: "Inventario", icon: Package },
  { href: "/invoices", label: "Facturas", icon: FileText },
  { href: "/reminders", label: "Recordatorios", icon: Mail },
  { href: "/portal/demo-token", label: "Portal demo", icon: ClipboardList },
  { href: "/login", label: "Ajustes/Login", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Image src="/assets/logo-mark.png" alt="Euromecanico Corp" width={94} height={94} priority />
          <strong>Euromecanico Corp</strong>
          <span />
        </div>
        <nav className="nav-list">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link className="nav-item" href={item.href} key={item.href}>
                <Icon className="nav-icon" size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="operator-card">
          <div className="avatar">JJ</div>
          <div>
            <strong>Jesiel N. Jimenez</strong>
            <span>Owner / Administrador</span>
          </div>
        </div>
        <div className="specialist-card">
          <Image src="/assets/porsche-rear.svg" alt="" width={190} height={84} />
          <p>Independent Porsche Specialists</p>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="topbar-actions">
        <input className="search-box" placeholder="Buscar cliente, VIN, RO..." />
        {action}
      </div>
    </header>
  );
}
