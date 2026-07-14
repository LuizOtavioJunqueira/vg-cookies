import { getFullSettings } from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
export const dynamic = "force-dynamic";
export default async function ConfigPage() {
  const settings = await getFullSettings();
  return <SettingsForm settings={settings} />;
}
