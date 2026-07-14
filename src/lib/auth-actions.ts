"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/painel-x7k2",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou senha incorretos.";
    }
    throw error; // deixa o redirect do Next passar
  }
}

export async function logout() {
  await signOut({ redirectTo: "/painel-x7k2/login" });
}
