import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Este campo é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "E-mail inválido";
    if (!password.trim()) errs.password = "Este campo é obrigatório";
    else if (password.length < 6) errs.password = "Mínimo de 6 caracteres";
    if (!isLogin && !fullName.trim()) errs.fullName = "Este campo é obrigatório";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Cadastro realizado!", description: "Verifique seu e-mail para confirmar a conta." });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">*{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-lg border border-border bg-card p-8"
      >
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight mb-8 justify-center">
          <BookOpen className="h-6 w-6 text-accent" />
          COMPIA Editora
        </Link>

        <h1 className="font-heading text-xl font-bold text-center mb-1">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          {isLogin ? "Acesse sua conta" : "Preencha os dados para se cadastrar"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label>Nome Completo *</Label>
              <Input placeholder="João Silva" value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors(p => { const n = {...p}; delete n.fullName; return n; }); }} className={errors.fullName ? "border-destructive" : ""} />
              <FieldError field="fullName" />
            </div>
          )}
          <div>
            <Label>E-mail *</Label>
            <Input type="email" placeholder="joao@email.com" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => { const n = {...p}; delete n.email; return n; }); }} className={errors.email ? "border-destructive" : ""} />
            <FieldError field="email" />
          </div>
          <div>
            <Label>Senha *</Label>
            <Input type="password" placeholder="••••••" value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = {...p}; delete n.password; return n; }); }} className={errors.password ? "border-destructive" : ""} />
            <FieldError field="password" />
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-muted-foreground">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-accent font-medium hover:underline">
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
