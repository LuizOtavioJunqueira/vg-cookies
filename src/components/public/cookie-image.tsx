import Image from "next/image";
import { clsx } from "clsx";

// Mostra a foto do Cloudinary; se ainda nao houver imagem, um placeholder tematico.
export function CookieImage({
  src,
  alt,
  className,
  rounded = "rounded-2xl",
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  if (!src) {
    return (
      <div
        className={clsx("ph-cookie aspect-square w-full", rounded, className)}
        role="img"
        aria-label={`${alt} (foto em breve)`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      className={clsx("aspect-square w-full object-cover", rounded, className)}
    />
  );
}
