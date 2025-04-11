"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

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
    setLogin(!!getCookie("token"));
  }, []);

  if (pathName === "/login") {
    return;
  }

  return (
    <Link href="/login">
      {login && (
        <Button
          size={size}
          variant="destructive"
          onClick={() => {
            deleteCookie("token");
          }}
          className={className}
        >
          <LogOut /> Sair
        </Button>
      )}

      {!login && (
        <Button size={size} variant="secondary" className={className}>
          Logar
        </Button>
      )}
    </Link>
  );
};
