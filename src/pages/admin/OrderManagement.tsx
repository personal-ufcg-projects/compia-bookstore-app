import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

const mockAdminOrders = [
  { id: "#1042", customer: "João Silva", date: "22/02/2026", total: "R$ 154,80", status: "Entregue", items: ["Fundamentos de IA", "Deep Learning na Prática"] },
  { id: "#1041", customer: "Maria Santos", date: "21/02/2026", total: "R$ 189,90", status: "Em trânsito", items: ["Kit ML Completo"] },
  { id: "#1040", customer: "Pedro Costa", date: "20/02/2026", total: "R$ 79,90", status: "Processando", items: ["Cibersegurança Moderna"] },
  { id: "#1039", customer: "Ana Lima", date: "19/02/2026", total: "R$ 64,90", status: "Entregue", items: ["Deep Learning na Prática"] },
  { id: "#1038", customer: "Carlos Oliveira", date: "18/02/2026", total: "R$ 249,70", status: "Entregue", items: ["Blockchain", "Smart Contracts", "Python DS"] },
];

const statusColors: Record<string, string> = {
  "Entregue": "bg-accent/15 text-accent-foreground",
  "Em trânsito": "bg-secondary text-secondary-foreground",
  "Processando": "bg-muted text-muted-foreground",
};

const OrderManagement = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Gestão de Pedidos</h1>
        <p className="text-muted-foreground text-sm">{mockAdminOrders.length} pedidos</p>
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Filtrar status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="processing">Processando</SelectItem>
          <SelectItem value="transit">Em trânsito</SelectItem>
          <SelectItem value="delivered">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Pedido</span><span>Cliente</span><span>Data</span><span>Total</span><span>Status</span><span>Ações</span>
      </div>
      {mockAdminOrders.map((o) => (
        <div key={o.id} className="grid md:grid-cols-6 gap-2 md:gap-4 p-4 border-t border-border items-center text-sm">
          <span className="font-semibold">{o.id}</span>
          <span>{o.customer}</span>
          <span className="text-muted-foreground">{o.date}</span>
          <span className="font-medium">{o.total}</span>
          <div><Badge className={statusColors[o.status] || ""}>{o.status}</Badge></div>
          <div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default OrderManagement;
