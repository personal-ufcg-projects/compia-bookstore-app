import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BookOpen, ArrowLeft, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/catalogo", label: "Catálogo", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/logs", label: "Logs", icon: ScrollText },
];

const AdminLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-heading text-sm font-bold">
            <BookOpen className="h-5 w-5 text-accent" />
            COMPIA Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-accent/15 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar à Loja
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex md:hidden items-center gap-3 p-4 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2 font-heading text-sm font-bold">
            <BookOpen className="h-5 w-5 text-accent" /> COMPIA Admin
          </Link>
          <div className="flex-1" />
          {adminLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <Link key={l.to} to={l.to}>
                <Button size="icon" variant={active ? "default" : "ghost"} className="h-8 w-8">
                  <l.icon className="h-4 w-4" />
                </Button>
              </Link>
            );
          })}
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
