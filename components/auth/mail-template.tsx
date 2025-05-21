import {
  Button,
  Container,
  Heading,
  Hr,
  Section,
  Tailwind,
} from "@react-email/components";
import { Mail } from "lucide-react";

type MailTemplateProps = {
  verificationLink: string;
};

export default function MailTemplate({ verificationLink }: MailTemplateProps) {
  return (
    <Tailwind>
      <Container>
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-md">
          {/* Header */}
          <Heading className="flex items-center px-6">
            <h1 className="text-xl font-semibold text-gray-800">FlashAI</h1>
          </Heading>

          <div className="flex w-full justify-center px-5">
            <Hr className="my-[5px] w-full border-t-2 border-gray-300" />
          </div>

          {/* Main Content */}
          <div className="px-6 py-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Welcome to FlashAI
            </h2>
            <p className="mb-6 text-[15px] text-gray-500">
              We're excited to have you on board. With flashAI, you can easily
              turn any PDF into interactive flashcards, making your study
              sessions more efficient and effective.
            </p>
            <p className="mb-6 text-[15px] text-gray-400">
              Ready to revolutionize your study method? Click the button below
            </p>

            <Button
              className="rounded-md bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
              href={verificationLink}
            >
              Create Your First Flashcard
            </Button>
          </div>

          {/* Divider */}
          <div className="flex w-full justify-center px-5">
            <Hr className="my-[16px] w-full border-t-2 border-gray-300" />
          </div>

          {/* Footer */}
          <Section className="text-center">
            <table className="mb-5 ml-5 w-full">
              <tr className="mb-5 w-full">
                <td align="left">
                  <p className="mb-4 text-sm text-gray-500">
                    If you have any questions, feel free to{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      contact our support team
                    </a>
                    .
                  </p>
                </td>
              </tr>
              <tr className="mb-5 w-full">
                <td align="left">
                  <div className="flex items-center text-gray-400">
                    <Mail className="mr-2 h-3 w-3" />
                    <small className="text-sm">support@flashAI.com</small>
                  </div>
                </td>
              </tr>
            </table>
          </Section>
        </div>
      </Container>
    </Tailwind>
  );
}
