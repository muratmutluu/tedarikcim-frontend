"use client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { data } from "@/lib/nav-data";
import { ChevronsUpDown } from "lucide-react";
import { useLogout } from "@/hooks/auth/useAuth";
import { getInitialsForAvatar } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    // Önce token'ı sil
    localStorage.removeItem("accessToken");

    logout(undefined, {
      onSettled: () => {
        // Mutation tamamlandıktan sonra yönlendir
        router.push("/login");
        router.refresh(); // Sayfayı yenile
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 ring-2 ring-accent">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {getInitialsForAvatar(data.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="max-md:hidden grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data.user.name}</span>
            <span className="truncate text-xs">{data.user.email}</span>
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
        {/* <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
