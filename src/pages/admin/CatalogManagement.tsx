import { useState } from "react";
import { motion } from "framer-motion";
import { products as initialProducts, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const CatalogManagement = () => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = productsList.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Gestão de Catálogo</h1>
          <p className="text-muted-foreground text-sm">{productsList.length} produtos cadastrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2" onClick={() => setEditingProduct(null)}>
              <Plus className="h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Título</Label><Input defaultValue={editingProduct?.title || ""} placeholder="Nome do livro" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Preço (R$)</Label><Input type="number" defaultValue={editingProduct?.price || ""} placeholder="89.90" /></div>
                <div><Label>Estoque</Label><Input type="number" defaultValue={editingProduct?.stockCount || ""} placeholder="50" /></div>
              </div>
              <div><Label>Autor</Label><Input defaultValue={editingProduct?.author || ""} placeholder="Nome do autor" /></div>
              <div><Label>URL da Imagem</Label><Input defaultValue={editingProduct?.image || ""} placeholder="https://..." /></div>
              <div><Label>Descrição</Label><Input defaultValue={editingProduct?.description || ""} placeholder="Sobre o livro..." /></div>
              <Button variant="hero" className="w-full" onClick={() => setIsDialogOpen(false)}>Salvar Produto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-2">Produto</span><span>Formato</span><span>Preço</span><span>Estoque</span><span>Ações</span>
        </div>
        {filtered.map((p) => (
          <div key={p.id} className="grid md:grid-cols-6 gap-2 md:gap-4 p-4 border-t border-border items-center text-sm">
            <div className="col-span-2 flex items-center gap-3">
              <img src={p.image} alt={p.title} className="h-12 w-9 rounded object-cover bg-muted hidden sm:block" />
              <div className="min-w-0">
                <p className="font-medium line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.author}</p>
              </div>
            </div>
            <div><Badge variant="secondary" className="text-[10px]">{p.format}</Badge></div>
            <div className="font-medium">R$ {p.price.toFixed(2)}</div>
            <div>
              <span className={p.stockCount === 0 ? "text-destructive" : "text-muted-foreground"}>
                {p.stockCount === 0 ? "Esgotado" : p.stockCount}
              </span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingProduct(p); setIsDialogOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CatalogManagement;
