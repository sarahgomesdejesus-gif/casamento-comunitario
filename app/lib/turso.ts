import { createClient } from "@libsql/client/web";

function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("A conexão com o banco ainda não foi configurada.");
  return createClient({ url, authToken });
}

export const turso = { execute: (...args: Parameters<ReturnType<typeof getClient>["execute"]>) => getClient().execute(...args) };

export function protocol() {
  const year = new Date().getFullYear();
  return `CC-${year}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function statusLabel(status: string) {
  return status === "approved" ? "Aprovado" : status === "rejected" ? "Não aprovado" : "Aguardando análise";
}
