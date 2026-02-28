import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Loader2 } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
  user_id: string | null;
}

const actionLabels: Record<string, string> = {
  signup: "Cadastro",
  login: "Login",
  logout: "Logout",
  order_created: "Pedido criado",
  product_added: "Produto adicionado",
  product_updated: "Produto editado",
  product_deleted: "Produto removido",
  role_changed: "Papel alterado",
};

const actionColors: Record<string, string> = {
  signup: "bg-accent/15 text-accent-foreground",
  login: "bg-secondary text-secondary-foreground",
  logout: "bg-muted text-muted-foreground",
  order_created: "bg-accent/15 text-accent-foreground",
  product_added: "bg-secondary text-secondary-foreground",
  product_updated: "bg-secondary text-secondary-foreground",
  product_deleted: "bg-destructive/15 text-destructive",
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setLogs(data as LogEntry[]);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-2xl font-bold mb-1">Logs de Atividade</h1>
      <p className="text-muted-foreground text-sm mb-8">Registro de ações realizadas no sistema</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum log de atividade registrado.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 gap-4 p-4 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Data/Hora</span>
            <span>Ação</span>
            <span>Entidade</span>
            <span>ID</span>
            <span>Detalhes</span>
          </div>
          {logs.map((log) => (
            <div key={log.id} className="grid sm:grid-cols-5 gap-2 sm:gap-4 p-4 border-t border-border items-center text-sm">
              <span className="text-muted-foreground text-xs">{formatDate(log.created_at)}</span>
              <Badge className={actionColors[log.action] || "bg-muted text-muted-foreground"}>
                {actionLabels[log.action] || log.action}
              </Badge>
              <span className="text-muted-foreground">{log.entity_type || "—"}</span>
              <span className="text-muted-foreground font-mono text-xs truncate">{log.entity_id || "—"}</span>
              <span className="text-xs text-muted-foreground truncate">
                {log.details ? JSON.stringify(log.details).slice(0, 60) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActivityLogs;
