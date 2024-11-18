import {
  createVerificationToken,
  deleteTokenById,
  getToken,
  getTokenByUserEmail,
  PrismaTransaction,
} from "@/lib/repository/auth/tokenRepository";
import {
  getUserByEmail,
  updateUserEmailStatus,
} from "@/lib/repository/auth/userRepository";
import { v4 as uuidV4 } from "uuid";

export const createVerificationTokenService = async (
  email: string,
  tx?: PrismaTransaction,
) => {
  const token = uuidV4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  const isTokenExisted = await getTokenByUserEmail(email);

  if (isTokenExisted) {
    await deleteTokenById(isTokenExisted.id);
  }

  const verificationToken = await createVerificationToken(
    {
      email: email,
      token: token,
      expiresAt: expiresAt,
    },
    tx,
  );

  if (!verificationToken) {
    return null;
  }

  return verificationToken;
};

export const verifyVerificationToken = async (
  token: string,
  tx?: PrismaTransaction,
) => {
  try {
    const existingToken = await getToken(token, tx);
    if (!existingToken) {
      return { error: "token not found" };
    }
    console.log("Token found");

    const hasExpired = new Date() > new Date(existingToken.expiresAt);

    if (hasExpired) {
      return { error: "expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email, tx);

    if (!existingUser) {
      return { error: "user not found" };
    }

    await updateUserEmailStatus(existingUser.id, tx);

    await deleteTokenById(existingToken.id, tx);

    // handle session

    return { success: "Email verified successfully!" };
  } catch (error: any) {
    console.log("Transaction failed with log: ", error.message);

    return { error: error.message };
  }
};
