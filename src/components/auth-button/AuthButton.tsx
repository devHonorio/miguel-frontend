"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const AuthButton = () => {
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
          size="sm"
          variant="destructive"
          onClick={() => {
            deleteCookie("token");
          }}
        >
          Sair
        </Button>
      )}

      {!login && (
        <Button size="sm" variant="secondary">
          Logar
        </Button>
      )}
    </Link>
  );
};
