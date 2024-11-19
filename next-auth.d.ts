export type ExtendedUser = DefaultSession["user"] & {
  username: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
