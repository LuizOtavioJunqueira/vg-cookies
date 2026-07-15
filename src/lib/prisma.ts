import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// O driver serverless da Neon precisa de um construtor de WebSocket.
// Node runtimes mais antigos (ex.: o da Vercel) nao tem WebSocket nativo,
// entao configuramos explicitamente para nao depender da versao do Node.
neonConfig.webSocketConstructor = ws;

// Driver adapter Neon (serverless-friendly, sem engine nativo).
// A connection string vem de DATABASE_URL.
const connectionString = process.env.DATABASE_URL ?? "";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
