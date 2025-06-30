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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const { data: account } = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
        if (!account) return null;

        const { data: user } = await api.users.getById(account.userId.toString()) as ActionResponse<IUserDoc>;
        if (!user) return null;

        const isValid = await bcrypt.compare(password, account.password!);
        if (!isValid) return null;

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
    async jwt({ token, user }) {
      // Inject role saat login
      if (user) {
        token.sub = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "user";
      }

      // Fallback untuk refresh session (jika role belum tersedia)
      if (!token.role) {
        const { data: acc } = await api.accounts.getByProvider(token.email as string) as ActionResponse<IAccountDoc>;
        if (acc) {
          const { data: dbUser } = await api.users.getById(acc.userId.toString()) as ActionResponse<IUserDoc>;
          if (dbUser) token.role = dbUser.role ?? "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as "admin" | "user";
      return session;
    },

    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!user || !account) return false;

      const username =
        account.provider === "github"
          ? (profile?.login as string)
          : (user.name?.toLowerCase() as string);

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
