import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CardSkeletonProps extends React.ComponentProps<typeof Card> {
  title?: string;
  description?: string;
  contentClassName?: string;
  variant?: "loading" | "error";
}

export function CardSkeleton({
  title = "Yükleniyor...",
  description = "Veriler yükleniyor...",
  contentClassName,
  variant = "loading",
  ...props
}: CardSkeletonProps) {
  return (
    <Card {...props} className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className={cn("flex items-center justify-center", contentClassName)}>
          {variant === "loading" ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          ) : (
            <div className="text-red-500">Bir hata oluştu, lütfen daha sonra tekrar deneyin.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
