import { motion } from "framer-motion";
import { Package, ShoppingCart, TrendingUp, DollarSign, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Produtos", value: "8", icon: Package, color: "bg-accent/15 text-accent" },
  { label: "Pedidos (mês)", value: "47", icon: ShoppingCart, color: "bg-secondary text-secondary-foreground" },
  { label: "Receita (mês)", value: "R$ 4.230", icon: DollarSign, color: "bg-accent/15 text-accent" },
  { label: "Crescimento", value: "+12%", icon: TrendingUp, color: "bg-secondary text-secondary-foreground" },
];

const AdminDashboard = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="font-heading text-2xl font-bold mb-1">Dashboard</h1>
    <p className="text-muted-foreground text-sm mb-8">Visão geral da sua loja</p>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-border bg-card p-5">
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${s.color} mb-3`}>
            <s.icon className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold font-heading">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Link to="/admin/catalogo" className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
        <Package className="h-6 w-6 text-accent mb-3" />
        <h3 className="font-heading font-semibold mb-1">Gestão de Catálogo</h3>
        <p className="text-sm text-muted-foreground">Adicione, edite e gerencie seus produtos.</p>
      </Link>
      <Link to="/admin/pedidos" className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
        <ShoppingCart className="h-6 w-6 text-accent mb-3" />
        <h3 className="font-heading font-semibold mb-1">Gestão de Pedidos</h3>
        <p className="text-sm text-muted-foreground">Acompanhe vendas e atualize status.</p>
      </Link>
      <Link to="/admin/logs" className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
        <ScrollText className="h-6 w-6 text-accent mb-3" />
        <h3 className="font-heading font-semibold mb-1">Logs de Atividade</h3>
        <p className="text-sm text-muted-foreground">Veja o registro de ações do sistema.</p>
      </Link>
    </div>
  </motion.div>
);

export default AdminDashboard;
