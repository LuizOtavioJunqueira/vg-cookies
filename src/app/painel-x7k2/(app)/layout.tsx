import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell user={{ name: user.name, role: user.role }}>{children}</AdminShell>;
}
