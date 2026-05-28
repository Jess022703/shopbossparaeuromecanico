import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ShopNav from "@/components/ShopNav";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="flex min-h-screen bg-shop-950 font-sans text-shop-100">
      <ShopNav />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
