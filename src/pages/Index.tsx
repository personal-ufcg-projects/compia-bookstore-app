import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-books.jpg";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const featuredProducts = products.filter((p) => p.originalPrice).slice(0, 4);
const newArrivals = products.filter((p) => !p.originalPrice).slice(0, 4);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="container-narrow py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent-foreground mb-6">
                🔥 Liquidação de Estoque
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Livros que moldam o{" "}
                <span className="text-accent">futuro</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Explore nossa coleção de publicações em Inteligência Artificial, Blockchain, Cibersegurança e muito mais — com até 30% de desconto.
              </p>
              <div className="flex gap-3 mt-8">
                <Link to="/catalogo">
                  <Button variant="hero" size="lg">
                    Ver Catálogo <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button variant="hero-outline" size="lg">
                    Ofertas
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Livros de tecnologia e inteligência artificial sobre mesa"
                className="w-full rounded-2xl shadow-2xl object-cover aspect-[16/10]"
              />
            </motion.div>
          </div>
        </section>

        {/* Featured / Promoções */}
        <section className="container-narrow py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">Promoções</h2>
              <p className="text-sm text-muted-foreground mt-1">Livros em oferta por tempo limitado</p>
            </div>
            <Link to="/catalogo" className="text-sm font-medium text-accent hover:underline hidden sm:block">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* New arrivals */}
        <section className="container-narrow py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">Novidades</h2>
              <p className="text-sm text-muted-foreground mt-1">Os mais recentes lançamentos</p>
            </div>
            <Link to="/catalogo" className="text-sm font-medium text-accent hover:underline hidden sm:block">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
