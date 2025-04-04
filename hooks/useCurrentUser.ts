import { useSession } from "next-auth/react";

type NavUserProps = {
  email: string;
  id: string;
  image: string;
  name: string;
  streak: number;
  username: string;
};

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  return session?.user as NavUserProps;
};
