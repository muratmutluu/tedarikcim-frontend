"use client";

import { ChevronsUpDown } from "lucide-react";
import { useLogout, useUser } from "@/hooks/auth/useAuth";
import { getInitialsForAvatar } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserNav() {
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to login page after logout
  };

  const { data } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 ring-2 ring-accent">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {getInitialsForAvatar(data.username)}
            </AvatarFallback>
          </Avatar>
          <div className="max-md:hidden grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data.username}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Ayarlar</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
