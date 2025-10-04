"use client";

import { deleteToken } from "@/app/services/auth/deleteToken";
import { Button } from "../ui/button";
import { AuthButtonProps } from "./AuthButton";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const SignOutButton = ({ className, size }: AuthButtonProps) => {
  const { push } = useRouter();
  return (
    <Button
      size={size}
      variant="destructive"
      onClick={async () => {
        await deleteToken();
        push("/login");
      }}
      className={className}
    >
      <LogOut /> Sair
    </Button>
  );
};
