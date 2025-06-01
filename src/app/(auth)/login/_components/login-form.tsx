import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Hesabınıza Giriş Yapın</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Kullanıcı adınız ve şifrenizle giriş yapın.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Kullanıcı Adı</Label>
          <Input id="username" type="text" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Şifre</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Şifremi Unuttum
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Giriş Yap
        </Button>
      </div>
    </form>
  );
}
