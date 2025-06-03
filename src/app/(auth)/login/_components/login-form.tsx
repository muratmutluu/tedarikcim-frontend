"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/auth/useAuth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Kullanıcı adı gereklidir")
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(1, "Şifre gereklidir").min(8, "Şifre en az 8 karakter olmalıdır"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login } = useLogin();

  const onSubmit = (data: LoginFormSchema) => {
    login(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Hesabınıza Giriş Yapın</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Kullanıcı adınız ve şifrenizle giriş yapın.
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Adı</FormLabel>
                <FormControl>
                  <Input placeholder="kullaniciadi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Şifre</FormLabel>
                  <a href="#" className="text-sm underline-offset-4 hover:underline">
                    Şifremi Unuttum
                  </a>
                </div>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
        </div>
      </form>
    </Form>
  );
}
