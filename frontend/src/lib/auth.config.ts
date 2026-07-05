import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
