import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

type SubmitButtonProps = {
  title: string;
  isDisabled: boolean;
};

export const SubmitButton = ({ title, isDisabled }: SubmitButtonProps) => {
  return (
    <>
      <Button
        type="submit"
        disabled={isDisabled}
        className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-800"
      >
        <ClipLoader
          color="white"
          size={15}
          className="mr-1"
          loading={isDisabled}
        />
        <p>{isDisabled ? "Loading..." : title}</p>
      </Button>
    </>
  );
};
