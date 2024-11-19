import { signIn } from "next-auth/react";

export const REDIRECT_ROUTE = "/dashboard/home";

export const signInWithGoogle = () => {
  signIn("google", {
    callbackUrl: REDIRECT_ROUTE,
  });
};
