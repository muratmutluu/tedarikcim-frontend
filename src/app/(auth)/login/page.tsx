import { Notebook } from "lucide-react";

import Image from "next/image";
import { LoginForm } from "./_components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center  gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Notebook className="size-4" />
            </div>
            <span className="font-semibold text-xl">Tedarikçim</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/hero.png"
          alt="Image"
          width={600}
          height={600}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale  grayscale-50"
        />
      </div>
    </div>
  );
}
