import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container-narrow py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
            <BookOpen className="h-5 w-5 text-accent" />
            COMPIA Editora
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Publicações especializadas em Inteligência Artificial e Tecnologia.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3">Navegação</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/catalogo" className="hover:text-foreground transition-colors">Catálogo</Link>
            <Link to="/cliente" className="hover:text-foreground transition-colors">Minha Conta</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3">Contato</h4>
          <p className="text-sm text-muted-foreground">contato@compiaeditora.com.br</p>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 COMPIA Editora. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
