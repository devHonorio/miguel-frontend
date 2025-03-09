import Link from "next/link";
import { Button } from "../ui/button";

import { AuthButton } from "../auth-button";

interface NavigationProps {
  paths: { name: string; path: string }[];
}
export const Navigation = ({ paths }: NavigationProps) => {
  return (
    <nav>
      {paths.map(({ path, name }) => (
        <Link href={path} key={path}>
          <Button variant="link" size={"sm"}>
            {name}
          </Button>
        </Link>
      ))}

      <AuthButton />
    </nav>
  );
};
