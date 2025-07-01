import bcrypt from "bcryptjs";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { SignInSchema } from "./lib/validations";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./models/Account.model";
import { IUserDoc } from "./models/User.model";
import { api } from "./lib/api";

// Exported auth functions used throughout the app: signIn, signOut, auth, etc.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,

    /**
     * Custom Credentials Provider for email/password-based login
     */
    Credentials({
      async authorize(credentials) {
        // Validate incoming credentials using Zod schema
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Fetch account data by email from the database
        const { data: account } = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
        if (!account) return null;

        // Fetch the associated user by userId
        const { data: user } = await api.users.getById(account.userId.toString()) as ActionResponse<IUserDoc>;
        if (!user) return null;

        // Validate password using bcrypt
        const isValid = await bcrypt.compare(password, account.password!);
        if (!isValid) return null;

        // Return the user object to encode into JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? "user",
        } as User;
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback runs on login and whenever a token is created/updated.
     * Responsible for embedding additional custom claims like `role` and database `_id` into token.
     */
    async jwt({ token, user, account }) {
      // On initial login
      if (user && account) {
        // Case: login via credentials (manual email/password)
        if (account.type === "credentials") {
          token.sub = user.id;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token.role = (user as any).role;
        } 
        // Case: login via OAuth (Google/GitHub)
        else if (account.type === "oauth") {
          const { data: dbUser } = await api.users.getByEmail(user.email as string) as ActionResponse<IUserDoc>;
          if (dbUser) {
            token.sub = (dbUser._id as { toString: () => string }).toString();
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },

    /**
     * Session callback: attaches token claims to `session.user`
     * This ensures that session carries user's Mongo `_id` and role.
     */
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as "admin" | "user";
      return session;
    },

    /**
     * signIn callback: runs whenever a user signs in (credentials or OAuth).
     * For OAuth logins, it ensures the user is stored in our DB via custom API.
     */
    async signIn({ user, profile, account }) {
      // Credentials sign-in is already handled — allow immediately
      if (account?.type === "credentials") return true;
      if (!user || !account) return false;

      // Generate a unique username based on the provider
      const username =
        account.provider === "github"
          ? (profile?.login as string)
          : (user.name?.toLowerCase() as string);

      // Store or update OAuth user in the DB via API
      const { success } = await api.auth.oAuthSignIn({
        user: {
          name: user.name!,
          email: user.email!,
          image: user.image!,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: (user as any).role ?? "user",
          username,
        },
        provider: account.provider as "google",
        providerAccountId: account.providerAccountId,
      });

      return success;
    },
  },
});
