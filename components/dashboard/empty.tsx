import { Button } from "@/components/ui/button";
import EmptyImage from "@/public/empty.svg";
import Image from "next/image";
import Link from "next/link";

type EmptyProps = {
  description: string;
  isActionButtonNeeded: boolean;
  actionButtonLink?: string;
  actionButtonText?: string;
  image?: string;
};

export const Empty = ({
  description,
  isActionButtonNeeded,
  actionButtonLink,
  actionButtonText,
  image,
}: EmptyProps) => {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <Image src={image || EmptyImage} alt="Empty" width={400} height={400} />
      <p className="mt-4 text-center text-2xl font-bold">OOPS</p>
      <p className="mt-1 text-lg font-light text-gray-500">{description}</p>
      {isActionButtonNeeded && (
        <Link href={actionButtonLink || "/"}>
          <Button className="mt-4" type="button">
            {actionButtonText}
          </Button>
        </Link>
      )}
    </div>
  );
};
