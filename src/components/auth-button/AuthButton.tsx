"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";

interface AuthButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export const AuthButton = ({
  className,
  size = "default",
}: AuthButtonProps) => {
  const pathName = usePathname();

  const [login, setLogin] = useState(false);

  useEffect(() => {
    const main = async () => {
      const token = await getCookie("token");
      setLogin(!!token);
    };

    main();
  }, []);

  const { push } = useRouter();

  if (pathName === "/login") {
    return;
  }

  return (
    <>
      {login && (
        <Button
          size={size}
          variant="destructive"
          onClick={async () => {
            await deleteCookie("token");
            push("/login");
          }}
          className={className}
        >
          <LogOut /> Sair
        </Button>
      )}

      {!login && (
        <Link href="/login">
          <Button size={size} variant="secondary" className={className}>
            <LogIn /> Logar
          </Button>
        </Link>
      )}
    </>
  );
};
