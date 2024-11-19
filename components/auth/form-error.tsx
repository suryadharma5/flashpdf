import { TriangleAlert } from "lucide-react";

type FormErrorProps = {
  message?: string;
  type: "warning" | "error";
};

export const FormError = ({ message, type }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-x-2 rounded-md ${type === "error" ? "bg-destructive/15 text-destructive" : "bg-yellow-100 text-amber-600"} p-3 text-sm`}
    >
      <TriangleAlert className="h-4 w-4" />
      {message}
    </div>
  );
};
