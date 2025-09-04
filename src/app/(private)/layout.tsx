"use client";
import { LayoutProps } from "@/app/layout";
import logo from "@/../public/icon.png";
import Image from "next/image";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Cherry,
  ClipboardList,
  CupSoda,
  Menu,
  NotebookTabs,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth-button";

const paths = [
  { path: "/admin/orders", name: "Pedidos", icon: <NotebookTabs /> },
  { path: "/admin/cups", name: "Copos", icon: <CupSoda /> },
  { path: "/admin/additional", name: "Adicionais", icon: <Cherry /> },
  { path: "/catalogo", name: "Catálogo", icon: <ClipboardList /> },
];

export default function PublicLayout({ children }: LayoutProps) {
  const pathName = usePathname();
  return (
    <div className="md:bg-primary/5 mx-auto flex w-4/5 flex-1 flex-col md:w-full md:flex-row">
      <header className="flex justify-between py-5 md:flex-col md:gap-5 md:p-5">
        <Image src={logo} alt="Logo Miguel Açaí" width={50} priority />

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button size="icon" variant="ghost">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col justify-between px-5 pb-5">
              <div>
                {paths.map(({ path, name, icon }) => (
                  <Link href={path} key={path}>
                    <Button
                      className="flex w-full items-center justify-start"
                      variant={pathName === path ? "secondary" : "ghost"}
                      size="lg"
                    >
                      {icon} {name}
                    </Button>
                  </Link>
                ))}
              </div>
              <AuthButton className="flex w-full justify-start" size="lg" />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden w-44 flex-1 flex-col justify-between md:flex">
          <div>
            {paths.map(({ path, name, icon }) => (
              <Link href={path} key={path}>
                <Button
                  className="flex w-full items-center justify-start"
                  variant={pathName === path ? "secondary" : "ghost"}
                  size="lg"
                >
                  {icon} {name}
                </Button>
              </Link>
            ))}
          </div>
          <AuthButton className="flex w-full justify-start" size="lg" />
        </div>
      </header>

      <main className="flex flex-col gap-5 rounded-2xl md:my-5 md:mr-5 md:w-full md:bg-white md:p-5">
        {children}
      </main>
    </div>
  );
}
