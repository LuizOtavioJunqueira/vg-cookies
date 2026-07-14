import type { NextAuthConfig } from "next-auth";

const LOGIN = "/painel-x7k2/login";
const PANEL = "/painel-x7k2";

// Config compartilhada e edge-safe. O provider Credentials (que usa bcrypt +
// prisma, incompatíveis com edge) é adicionado só em auth.ts (runtime Node).
export const authConfig = {
  trustHost: true,
  pages: { signIn: LOGIN },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isPanel = path.startsWith(PANEL);
      const isLogin = path.startsWith(LOGIN);

      if (isLogin) {
        // já logado tentando ver o login → manda pro painel
        if (isLoggedIn) return Response.redirect(new URL(PANEL, nextUrl));
        return true;
      }
      if (isPanel) return isLoggedIn; // resto do painel exige sessão
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
