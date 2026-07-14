import { requireSuperAdmin } from "@/lib/session";
import { getAdmins } from "@/lib/admin-data";
import { AdminsManager } from "@/components/admin/admins-manager";
export const dynamic = "force-dynamic";
export default async function AdminsPage() {
  const me = await requireSuperAdmin();
  const admins = await getAdmins();
  return <AdminsManager admins={admins} currentId={me.id} />;
}
