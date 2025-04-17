"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useOrderStore } from "@/app/store/order";
import { Badge } from "../ui/badge";

export const CartButton = () => {
  const { cups } = useOrderStore();
  return (
    <Link href="/orderDetails" className="relative">
      {!!cups.length && (
        <Badge
          variant="secondary"
          className="absolute -top-1 -right-1 animate-bounce"
        >
          {cups.length}
        </Badge>
      )}
      <Button size="icon">
        <ShoppingCart />
      </Button>
    </Link>
  );
};
