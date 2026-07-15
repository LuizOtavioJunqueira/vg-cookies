import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // Evita que o Next.js empacote essas libs (elas usam WebSocket/código nativo
  // que quebra quando processado pelo bundler). Ficam carregadas direto do
  // node_modules em runtime, como deveria ser.
  serverExternalPackages: ["ws", "@neondatabase/serverless", "@prisma/adapter-neon"],
};

export default nextConfig;
