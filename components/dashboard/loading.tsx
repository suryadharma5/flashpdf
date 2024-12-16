import LoadingImage from "@/public/loading-img.svg";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

type LoadingPageProps = {
  text?: string;
};

export const LoadingPage = ({ text }: LoadingPageProps) => {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-6">
      <Image
        src={LoadingImage}
        alt="loading image"
        width={200}
        height={200}
        className="mb-5"
      />
      {text != undefined ? <p>{text}</p> : <p>Loading...</p>}
      <ClipLoader />
    </div>
  );
};
