export type ExtendedUser = DefaultSession["user"] & {
  username: string;
  streak: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
