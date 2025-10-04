"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PathButtonProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}
export const PathButton = ({ name, path, icon }: PathButtonProps) => {
  const pathName = usePathname();
  return (
    <Link href={path} key={path}>
      <Button
        className="flex w-full items-center justify-start"
        variant={path === pathName ? "secondary" : "ghost"}
        size="lg"
      >
        {icon} {name}
      </Button>
    </Link>
  );
};
