import { Button } from "@/components/ui/button";
import NotFoundImage from "@/public/not-found-page.svg";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src={NotFoundImage}
        alt="Not found image"
        width={400}
        height={400}
      />
      <h1 className="mt-12 text-6xl font-bold">OOPS!</h1>
      <p className="mt-4 text-2xl">PAGE NOT FOUND</p>
      <Link href="/">
        <Button className="mt-5 px-12 py-2">Go back home</Button>
      </Link>
    </div>
  );
}
