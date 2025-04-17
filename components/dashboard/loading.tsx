import LoadingImage from "@/public/loading-img.svg";
import Image from "next/image";

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
        className="duration-[2000ms] mb-5 animate-bounce transition delay-150 ease-in-out"
      />
      {text != undefined ? (
        <p className="animate-pulse">{text}</p>
      ) : (
        <p className="animate-pulse">Loading...</p>
      )}
      {/* <Loader2 className="h-8 w-8 animate-spin" /> */}
    </div>
  );
};
