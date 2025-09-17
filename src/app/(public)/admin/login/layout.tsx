import { LayoutProps } from "@/app/layout";
import logo from "@/../public/logo.png";
import Image from "next/image";
export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex w-xs flex-col justify-center">
      <Image
        src={logo}
        alt="Logo Miguel Açaí"
        width={200}
        className="mx-auto"
      />
      {children}
    </div>
  );
}
