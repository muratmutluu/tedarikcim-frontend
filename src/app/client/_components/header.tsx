import { ThemeToggle } from "@/components/layouts/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { Notebook } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/50">
      <div className="flex flex-1 px-3">
        <Link href="/client" className="flex items-center space-x-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Notebook className="size-4" />
          </div>
          <span className="font-semibold text-xl">Tedarikçim</span>
        </Link>
      </div>
      <div className="flex items-center space-x-1 px-3">
        <ThemeToggle />
        <Separator orientation="vertical" className="!h-5" />
        <UserNav />
      </div>
    </header>
  );
}
