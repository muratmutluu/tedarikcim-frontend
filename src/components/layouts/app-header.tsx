import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import Breadcrumbs from "./breadcrumbs";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/50">
      <div className="flex flex-1 items-center space-x-1 px-3">
        <SidebarTrigger className="size-9" />
        <Separator orientation="vertical" className="!h-5" />
        <Breadcrumbs />
        {/* <GoBackButton /> */}
      </div>
      <div className="flex items-center space-x-1 px-3">
        <ThemeToggle />
        <Separator orientation="vertical" className="!h-5" />
        <UserNav />
      </div>
    </header>
  );
}
