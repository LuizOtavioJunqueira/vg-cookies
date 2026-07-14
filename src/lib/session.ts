import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Para páginas: redireciona se não autorizado.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/painel-x7k2/login");
  return session.user;
}

export async function requireSuperAdmin() {
  const user = await requireAdmin();
  if (user.role !== "SUPER_ADMIN") redirect("/painel-x7k2");
  return user;
}

// Para server actions / rotas: lança se não autorizado (nunca confiar só no middleware).
export async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");
  return session.user;
}

export async function assertSuperAdmin() {
  const user = await assertAdmin();
  if (user.role !== "SUPER_ADMIN") throw new Error("Ação restrita ao super admin.");
  return user;
}
