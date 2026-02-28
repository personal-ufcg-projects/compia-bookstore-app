import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice > 150 ? 0 : 14.90;
  const total = totalPrice + shipping;

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-card">
        <SheetHeader>
          <SheetTitle className="font-heading flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground text-sm">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.image} alt={product.title} className="h-20 w-14 rounded object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-2">{product.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.format}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeItem(product.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-semibold">R$ {(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>{shipping === 0 ? <span className="text-accent font-medium">Grátis</span> : `R$ ${shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold font-heading">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <Button
                variant="hero"
                className="w-full"
                size="lg"
                onClick={() => { setIsCartOpen(false); navigate("/checkout"); }}
              >
                Finalizar Compra
              </Button>
              {totalPrice < 150 && (
                <p className="text-[11px] text-center text-muted-foreground">
                  Frete grátis para compras acima de R$ 150,00
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
