import { getFullSettings } from "@/lib/admin-data";
import { ContentForm } from "@/components/admin/content-form";
export const dynamic = "force-dynamic";
export default async function ConteudoPage() {
  const settings = await getFullSettings();
  return <ContentForm settings={settings} />;
}
