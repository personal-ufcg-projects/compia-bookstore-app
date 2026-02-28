import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

const formatTag: Record<string, string> = {
  "Físico": "bg-secondary text-secondary-foreground",
  "E-book": "bg-accent/15 text-accent-foreground",
  "Kit": "bg-primary text-primary-foreground",
};

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className={`text-[10px] font-semibold ${formatTag[product.format] || ""}`}>
            {product.format}
          </Badge>
          {!product.inStock && (
            <Badge variant="destructive" className="text-[10px]">Esgotado</Badge>
          )}
        </div>
        {product.originalPrice && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-accent-foreground text-[10px] font-bold">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.author}</p>
        <h3 className="font-heading text-sm font-semibold leading-snug mb-2 line-clamp-2">{product.title}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through mr-2">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold font-heading">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <Button
            size="icon"
            variant="hero"
            disabled={!product.inStock}
            onClick={() => addItem(product)}
            className="h-9 w-9 rounded-full"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {product.inStock && product.stockCount <= 15 && product.format !== "E-book" && (
          <p className="text-[10px] text-muted-foreground mt-2">
            Apenas {product.stockCount} em estoque
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
