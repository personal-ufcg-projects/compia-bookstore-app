import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { products, categories, type ProductCategory, type ProductFormat } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";

const formats: ProductFormat[] = ["Físico", "E-book", "Kit"];

const Catalog = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedFormat && p.format !== selectedFormat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clearFilters = () => { setSelectedCategory(null); setSelectedFormat(null); setSearch(""); };
  const hasFilters = selectedCategory || selectedFormat || search;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1 container-narrow py-8 md:py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Catálogo</h1>
          <p className="text-muted-foreground text-sm mb-8">Explore todos os nossos títulos</p>

          {/* Search + filter toggle */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar livros..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </Button>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden mb-8 space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Categoria</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Button key={c} size="sm" variant={selectedCategory === c ? "default" : "outline"} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Formato</p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <Button key={f} size="sm" variant={selectedFormat === f ? "default" : "outline"} onClick={() => setSelectedFormat(selectedFormat === f ? null : f)}>
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">Nenhum produto encontrado.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-6">{filtered.length} produto(s) encontrado(s)</p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
