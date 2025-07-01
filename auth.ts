// Import dependencies for authentication and encryption
import bcrypt from "bcryptjs";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Import internal modules: validation schema, API helpers, and types
import { SignInSchema } from "./lib/validations";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./models/Account.model";
import { IUserDoc } from "./models/User.model";
import { api } from "./lib/api";

// Initialize NextAuth with custom configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // OAuth Provider: Google
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),

    /**
     * Custom Credentials Provider for manual email/password login.
     * Uses bcrypt for password comparison and checks against MongoDB account and user collections.
     */
    Credentials({
      async authorize(credentials) {
        // Validate input credentials with Zod schema
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Fetch account (login data) using email
        const { data: account } = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
        if (!account) return null;

        // Fetch full user profile from account reference
        const { data: user } = await api.users.getById(account.userId.toString()) as ActionResponse<IUserDoc>;
        if (!user) return null;

        // Compare entered password with hashed one
        const isValid = await bcrypt.compare(password, account.password!);
        if (!isValid) return null;

        // Return user payload to be embedded into JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? "user", // Default role is 'user' if missing
        } as User;
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback is triggered during login and whenever the token is updated.
     * It embeds custom data like `role` and MongoDB `_id` into the JWT payload.
     */
    async jwt({ token, user, account }) {
      // On first login, 'user' and 'account' will be present
      if (user && account) {
        // Always assign user's id into token.sub
        token.sub = user.id;

        // Set the role explicitly from user object or fallback
        // `as any` is used to access custom field not present on default `User` type
        // Role is injected in signIn() callback earlier
        // This applies for both credentials and OAuth login
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "user";

        // If OAuth login, fetch user again from DB to get correct _id and role
        if (account.type === "oauth") {
          const { data: dbUser } = await api.users.getByEmail(user.email as string) as ActionResponse<IUserDoc>;

          // If DB user found, override token.sub and token.role with correct values
          if (dbUser) {
            token.sub = (dbUser._id as { toString: () => string }).toString();
            token.role = dbUser.role ?? "user";
          } else {
            // Fallback role if DB user not found
            token.role = "user";
          }
        }
      }

      // Fallback to prevent undefined roles in token
      if (!token.role) {
        token.role = "user";
      }

      return token;
    },

    /**
     * Session callback runs after JWT callback.
     * It injects values from the token into the session object,
     * making them accessible from the client (e.g., `session.user.role`)
     */
    async session({ session, token }) {
      // Attach MongoDB user ID to session
      session.user.id = token.sub as string;

      // Attach role to session, used for role-based UI or API auth
      session.user.role = token.role as "admin" | "user";

      return session;
    },

    /**
     * signIn callback is triggered after user authenticates (OAuth or credentials).
     * For OAuth users, this ensures they exist in the DB and injects their role for downstream use in jwt().
     */
    async signIn({ user, profile, account }) {
      // For credentials login, proceed immediately (role already handled in authorize)
      if (account?.type === "credentials") return true;

      if (!user || !account) return false;

      // Create a unique username depending on the OAuth provider
      const username = account.provider === "github"
        ? (profile?.login as string)
        : (user.name?.toLowerCase() as string);

      // Fetch existing user from DB using email
      const { data: existingUser } = await api.users.getByEmail(user.email!) as ActionResponse<IUserDoc>;

      if (existingUser) {
        // Inject role and id into the user object for use in jwt()
        user.id = (existingUser._id as { toString: () => string }).toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any).role = existingUser.role;
      } else {
        // Default to role "user" if not found
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any).role = "user";
      }

      // Save/update user in DB to keep data consistent (image, name, etc.)
      const { success } = await api.auth.oAuthSignIn({
        user: {
          name: user.name!,
          email: user.email!,
          image: user.image!,
          role: existingUser?.role ?? "user",
          username,
        },
        provider: account.provider as "google",
        providerAccountId: account.providerAccountId,
      });

      // Return true to proceed with authentication
      return success;
    },
  },
});
