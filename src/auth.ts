import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        try {
          const admin = await prisma.admin.findUnique({ where: { email } });
          if (!admin) return null;

          const ok = await bcrypt.compare(password, admin.passwordHash);
          if (!ok) return null;

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        } catch (e) {
          console.error("[authorize] falha ao consultar o banco:", e);
          return null;
        }
      },
    }),
  ],
});
