"use client";

import { SquareChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()} disabled={pathname === "/"}>
      <SquareChevronLeft />
    </Button>
  );
}
