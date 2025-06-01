"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

// Route mapping için
const routeLabels: Record<string, string> = {
  "": "Ana Sayfa",
  invoices: "Faturalar",
  customers: "Müşteriler",
  suppliers: "Tedarikçiler",
  transactions: "Hareketler",
  settings: "Ayarlar",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Pathname'i segmentlere ayır
  const segments = pathname.split("/").filter(Boolean);

  // Breadcrumb items oluştur
  const breadcrumbItems = [];

  // Ana sayfa her zaman ilk item
  if (segments.length > 0) {
    breadcrumbItems.push({
      label: "Ana Sayfa",
      href: "/",
      isLast: false,
    });
  }

  // Her segment için breadcrumb item oluştur
  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbItems.push({
      label,
      href,
      isLast,
    });
  });

  if (pathname === "/" && breadcrumbItems.length === 0) {
    breadcrumbItems.push({
      label: "Ana Sayfa",
      href: "/",
      isLast: true,
    });
  }

  return (
    <Breadcrumb className="pl-1">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && (
              <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
