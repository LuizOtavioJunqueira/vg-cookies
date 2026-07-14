import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getAllProducts();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductForm product={product} />;
}
