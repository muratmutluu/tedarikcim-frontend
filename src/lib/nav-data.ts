import { Factory, FileText, LayoutDashboardIcon, Settings, Users } from "lucide-react";

export const data = {
  user: {
    name: "Mutlular Sünger",
    email: "mutlularsunger@hotmail.com",
    avatar: "/ms-avatar.png",
  },
  nav: [
    {
      title: "Ana Sayfa",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Faturalar",
      url: "/invoices",
      icon: FileText,
    },
    {
      title: "Müşteriler",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Tedarikçiler",
      url: "/suppliers",
      icon: Factory,
    },
    {
      title: "Ayarlar",
      url: "/settings",
      icon: Settings,
    },
  ],
};
