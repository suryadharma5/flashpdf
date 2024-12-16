import { Button } from "@/components/ui/button";
import NotFoundImage from "@/public/not-found-page.svg";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <Image
        src={NotFoundImage}
        alt="Not found image"
        width={300}
        height={300}
      />
      <h1 className="mt-12 text-4xl font-bold">OOPS!</h1>
      <p className="mt-4 text-xl">SOMETHING WENT WRONG</p>
      <Link href="/">
        <Button className="mt-5 px-8 py-2">Go back home</Button>
      </Link>
    </div>
  );
}
