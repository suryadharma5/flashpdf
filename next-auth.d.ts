export type ExtendedUser = DefaultSession["user"] & {
  username: string;
  streak: number;
  longestStreak: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
