import Link from "next/link";
import { Button } from "../ui/button";

import { AuthButton } from "../auth-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";

interface NavigationProps {
  paths: { name: string; path: string }[];
}
export const Navigation = ({ paths }: NavigationProps) => {
  return (
    <nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          {paths.map(({ path, name }) => (
            <Link href={path} key={path}>
              <Button variant="link" size={"sm"}>
                {name}
              </Button>
            </Link>
          ))}
          <div className="mt-auto flex justify-end p-5">
            <AuthButton />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
