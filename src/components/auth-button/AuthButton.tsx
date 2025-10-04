"use server";

import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { getToken } from "@/app/services/auth/getToken";
import { SignOutButton } from "./signout";

export interface AuthButtonProps {
  hidden?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export const AuthButton = async ({
  hidden,
  className,
  size = "default",
}: AuthButtonProps) => {
  if (hidden) return;

  const token = await getToken();

  return (
    <>
      {!!token && <SignOutButton />}

      {!token && (
        <Link href="/login">
          <Button size={size} variant="secondary" className={className}>
            <LogIn /> Logar
          </Button>
        </Link>
      )}
    </>
  );
};
