import authConfig from "@/auth.config";
import { prismaClient } from "@/lib/db";
import {
  getUserById,
  updateUserUsername,
} from "@/lib/repository/auth/userRepository";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    // handle if user not verified, then user is not allow signin
    async signIn({ user, account }) {
      // Allow oauth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id ?? "");

      // prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },

    async session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.username = token.username;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      if (existingUser.username) {
        token.username = existingUser.username;
      } else {
        const newUsername = existingUser.email.split("@")[0].slice(0, 20);
        await updateUserUsername(existingUser.id, newUsername);
      }

      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  // next-auth will always redirect to this page if something went wrong
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  adapter: PrismaAdapter(prismaClient),
  session: { strategy: "jwt" },
  ...authConfig,
});
