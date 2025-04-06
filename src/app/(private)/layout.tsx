import { LayoutProps } from "@/app/layout";
import logo from "@/../public/icon.png";
import Image from "next/image";

import { Navigation } from "@/components/navigation";

const paths = [
  { path: "/catalogo", name: "Catálogo" },
  { path: "/admin/cups", name: "Copos" },
];

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <>
      <header className="flex items-center justify-between gap-5 px-10 py-2">
        <Image src={logo} alt="Logo Miguel Açaí" width={50} priority />

        <Navigation paths={paths} />
      </header>

      <main className="flex flex-1">{children}</main>
    </>
  );
}
