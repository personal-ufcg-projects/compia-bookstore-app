import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CreditCard, QrCode, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const steps = ["Endereço", "Pagamento", "Confirmação"];

interface AddressForm {
  nome: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface CardForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

const initialAddress: AddressForm = {
  nome: "", email: "", cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
};

const initialCard: CardForm = { cardNumber: "", expiry: "", cvv: "", cardName: "" };

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState<AddressForm>(initialAddress);
  const [card, setCard] = useState<CardForm>(initialCard);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const shipping = totalPrice > 150 ? 0 : 14.9;
  const total = totalPrice + shipping;

  const setField = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const setCardField = (field: string, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const fetchCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
        // Clear errors for auto-filled fields
        setErrors((prev) => {
          const n = { ...prev };
          delete n.endereco; delete n.bairro; delete n.cidade; delete n.estado;
          return n;
        });
      }
    } catch {
      // silently fail
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (value: string) => {
    // Format CEP: 00000-000
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setField("cep", formatted);
    if (digits.length === 8) fetchCep(digits);
  };

  const validateAddress = (): boolean => {
    const errs: Record<string, string> = {};
    if (!address.nome.trim()) errs.nome = "Este campo é obrigatório";
    if (!address.email.trim()) errs.email = "Este campo é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errs.email = "E-mail inválido";
    if (!address.cep.trim()) errs.cep = "Este campo é obrigatório";
    else if (address.cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
    if (!address.endereco.trim()) errs.endereco = "Este campo é obrigatório";
    if (!address.numero.trim()) errs.numero = "Este campo é obrigatório";
    if (!address.cidade.trim()) errs.cidade = "Este campo é obrigatório";
    if (!address.estado.trim()) errs.estado = "Este campo é obrigatório";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === "pix") return true;
    const errs: Record<string, string> = {};
    if (!card.cardNumber.replace(/\s/g, "").trim()) errs.cardNumber = "Este campo é obrigatório";
    else if (card.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Número do cartão inválido";
    if (!card.expiry.trim()) errs.expiry = "Este campo é obrigatório";
    if (!card.cvv.trim()) errs.cvv = "Este campo é obrigatório";
    else if (card.cvv.length < 3) errs.cvv = "CVV inválido";
    if (!card.cardName.trim()) errs.cardName = "Este campo é obrigatório";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateAddress()) return;
    if (step === 1 && !validatePayment()) return;
    setErrors({});
    setStep(step + 1);
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">*{errors[field]}</p> : null;

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header /><CartDrawer />
        <main className="flex-1 container-narrow py-20 text-center">
          <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
          <Link to="/catalogo"><Button variant="hero">Ir para o Catálogo</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header /><CartDrawer />
        <main className="flex-1 container-narrow py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground text-sm mb-6">Você receberá um e-mail com os detalhes do pedido.</p>
            <Link to="/"><Button variant="hero">Voltar à Loja</Button></Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header /><CartDrawer />
      <main className="flex-1 container-narrow py-8 md:py-12">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-bold mb-4">Endereço de Entrega</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo *</Label>
                      <Input placeholder="João Silva" value={address.nome} onChange={(e) => setField("nome", e.target.value)} className={errors.nome ? "border-destructive" : ""} />
                      <FieldError field="nome" />
                    </div>
                    <div>
                      <Label>E-mail *</Label>
                      <Input type="email" placeholder="joao@email.com" value={address.email} onChange={(e) => setField("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                      <FieldError field="email" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label>CEP *</Label>
                      <div className="relative">
                        <Input placeholder="00000-000" value={address.cep} onChange={(e) => handleCepChange(e.target.value)} className={errors.cep ? "border-destructive" : ""} />
                        {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                      </div>
                      <FieldError field="cep" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Endereço *</Label>
                      <Input placeholder="Rua..." value={address.endereco} onChange={(e) => setField("endereco", e.target.value)} className={errors.endereco ? "border-destructive" : ""} />
                      <FieldError field="endereco" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div>
                      <Label>Número *</Label>
                      <Input placeholder="123" value={address.numero} onChange={(e) => setField("numero", e.target.value)} className={errors.numero ? "border-destructive" : ""} />
                      <FieldError field="numero" />
                    </div>
                    <div>
                      <Label>Complemento</Label>
                      <Input placeholder="Apto 4B" value={address.complemento} onChange={(e) => setField("complemento", e.target.value)} />
                    </div>
                    <div>
                      <Label>Bairro</Label>
                      <Input placeholder="Centro" value={address.bairro} onChange={(e) => setField("bairro", e.target.value)} />
                    </div>
                    <div>
                      <Label>Cidade *</Label>
                      <Input placeholder="São Paulo" value={address.cidade} onChange={(e) => setField("cidade", e.target.value)} className={errors.cidade ? "border-destructive" : ""} />
                      <FieldError field="cidade" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div>
                      <Label>Estado *</Label>
                      <Input placeholder="SP" maxLength={2} value={address.estado} onChange={(e) => setField("estado", e.target.value.toUpperCase())} className={errors.estado ? "border-destructive" : ""} />
                      <FieldError field="estado" />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-bold mb-4">Forma de Pagamento</h2>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setErrors({}); }} className="space-y-3">
                    <label className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-accent bg-accent/5" : "border-border"}`}>
                      <RadioGroupItem value="card" />
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Cartão de Crédito</p>
                        <p className="text-xs text-muted-foreground">Visa, MasterCard, Elo</p>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">VISA</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">MC</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">ELO</span>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "pix" ? "border-accent bg-accent/5" : "border-border"}`}>
                      <RadioGroupItem value="pix" />
                      <QrCode className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">PIX</p>
                        <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                      </div>
                    </label>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
                      <div>
                        <Label>Número do Cartão *</Label>
                        <Input placeholder="0000 0000 0000 0000" value={card.cardNumber} onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                          setCardField("cardNumber", formatted);
                        }} className={errors.cardNumber ? "border-destructive" : ""} />
                        <FieldError field="cardNumber" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Validade *</Label>
                          <Input placeholder="MM/AA" value={card.expiry} onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                            const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                            setCardField("expiry", formatted);
                          }} className={errors.expiry ? "border-destructive" : ""} />
                          <FieldError field="expiry" />
                        </div>
                        <div>
                          <Label>CVV *</Label>
                          <Input placeholder="123" value={card.cvv} onChange={(e) => setCardField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} className={errors.cvv ? "border-destructive" : ""} />
                          <FieldError field="cvv" />
                        </div>
                      </div>
                      <div>
                        <Label>Nome no Cartão *</Label>
                        <Input placeholder="JOÃO SILVA" value={card.cardName} onChange={(e) => setCardField("cardName", e.target.value.toUpperCase())} className={errors.cardName ? "border-destructive" : ""} />
                        <FieldError field="cardName" />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "pix" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center space-y-4">
                      <div className="mx-auto w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                        <QrCode className="h-24 w-24 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Chave PIX (copia e cola):</p>
                        <code className="text-xs bg-muted px-3 py-1.5 rounded select-all">00020126360014br.gov.bcb.pix</code>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-bold mb-4">Resumo do Pedido</h2>
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img src={product.image} alt={product.title} className="h-12 w-9 rounded object-cover bg-muted" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                          <p className="text-xs text-muted-foreground">Qtd: {quantity}</p>
                        </div>
                        <span className="text-sm font-semibold">R$ {(product.price * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Entrega:</span> {address.endereco}, {address.numero} — {address.cidade}/{address.estado}</p>
                    <p><span className="text-muted-foreground">Pagamento:</span> {paymentMethod === "card" ? `Cartão ****${card.cardNumber.replace(/\s/g, "").slice(-4)}` : "PIX"}</p>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" disabled={step === 0} onClick={() => { setErrors({}); setStep(step - 1); }}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              {step < 2 ? (
                <Button variant="hero" onClick={handleNext}>
                  Continuar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button variant="hero" onClick={() => { clearCart(); setOrderPlaced(true); }}>
                  Confirmar Pedido
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 h-fit sticky top-20">
            <h3 className="font-heading text-sm font-semibold mb-4">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R$ {totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span></div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold font-heading text-base"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
