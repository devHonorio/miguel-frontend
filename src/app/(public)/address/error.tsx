"use client"; // Error boundaries must be Client Components

import { AuthButton } from "@/components/auth-button";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 px-10">
      <p className="text-2xl font-bold">
        Ocorreu algum erro, tente sair e entrar da sua conta!
      </p>
      <AuthButton />
    </div>
  );
}
