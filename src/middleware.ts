import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Middleware usa só a config edge-safe. Protege todo /painel-x7k2 (exceto login,
// tratado no callback authorized). Sem sessão → redireciona pro login.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/painel-x7k2/:path*"],
};
