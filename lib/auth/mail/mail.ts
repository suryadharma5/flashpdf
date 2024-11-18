import MailTemplate from "@/components/auth/mail-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
  const baseURL = process.env.BASE_URL;
  const confirmLink = `${baseURL}/verification-email?token=${token}`;

  const emailSent = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "FlashAI Email Verification",
    react: MailTemplate({ verificationLink: confirmLink }),
  });

  return emailSent;
};
