import { getAdminGallery } from "@/lib/admin-data";
import { GalleryManager } from "@/components/admin/gallery-manager";
export const dynamic = "force-dynamic";
export default async function GaleriaPage() {
  const photos = await getAdminGallery();
  return <GalleryManager photos={photos} />;
}
