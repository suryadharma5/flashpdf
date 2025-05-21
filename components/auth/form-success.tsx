import { CircleCheckBig } from "lucide-react";

type FormErrorProps = {
  message?: string | null;
};

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-x-2 rounded-md bg-green-400 p-3 text-sm text-white`}
    >
      <CircleCheckBig className="h-4 w-4" />
      {message}
    </div>
  );
};
