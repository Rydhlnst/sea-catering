import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: "user" | "admin";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    email?: string;
    role?: "user" | "admin";
  }
}
