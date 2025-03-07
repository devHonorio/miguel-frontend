import { LayoutProps } from "@/app/layout";
import logo from "@/../public/icon.png";
import Image from "next/image";
export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-xs flex-col items-center justify-center gap-10">
      <Image src={logo} alt="Logo Migel Açaí" width={250} />
      {children}
    </div>
  );
}
