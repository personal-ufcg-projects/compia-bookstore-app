import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Package, BookOpen } from "lucide-react";

const mockOrders = [
  { id: "#1042", date: "22/02/2026", total: "R$ 154,80", status: "Entregue", items: 2 },
  { id: "#1038", date: "15/02/2026", total: "R$ 64,90", status: "Em trânsito", items: 1 },
  { id: "#1025", date: "03/02/2026", total: "R$ 249,70", status: "Processando", items: 3 },
];

const mockEbooks = [
  { title: "Deep Learning na Prática", format: "PDF", size: "12 MB" },
  { title: "Python para Data Science", format: "EPUB", size: "8 MB" },
  { title: "Smart Contracts com Solidity", format: "PDF", size: "15 MB" },
];

const statusColors: Record<string, string> = {
  "Entregue": "bg-accent/15 text-accent-foreground",
  "Em trânsito": "bg-secondary text-secondary-foreground",
  "Processando": "bg-muted text-muted-foreground",
};

const CustomerArea = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header /><CartDrawer />
      <main className="flex-1 container-narrow py-8 md:py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-heading text-3xl font-bold mb-1">Minha Conta</h1>
          <p className="text-muted-foreground text-sm mb-8">Gerencie seus pedidos e downloads</p>

          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" /> Histórico de Compras</TabsTrigger>
              <TabsTrigger value="ebooks" className="gap-2"><BookOpen className="h-4 w-4" /> Meus E-books</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 gap-4 p-4 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Pedido</span><span>Data</span><span>Itens</span><span>Total</span><span>Status</span>
                </div>
                {mockOrders.map((o) => (
                  <div key={o.id} className="grid sm:grid-cols-5 gap-2 sm:gap-4 p-4 border-t border-border items-center text-sm">
                    <span className="font-semibold">{o.id}</span>
                    <span className="text-muted-foreground">{o.date}</span>
                    <span>{o.items} item(s)</span>
                    <span className="font-medium">{o.total}</span>
                    <Badge className={statusColors[o.status] || ""}>{o.status}</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ebooks">
              <div className="space-y-3">
                {mockEbooks.map((e) => (
                  <div key={e.title} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.format} · {e.size}</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerArea;
