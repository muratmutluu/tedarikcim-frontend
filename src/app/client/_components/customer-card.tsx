"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getInitialsForAvatar } from "@/lib/utils";
import { Customer } from "@/types";
import {
  ArrowRightLeft,
  Building,
  Calendar,
  Hash,
  Mail,
  MapPin,
  Phone,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";

export function CustomerCard({
  customer,
  onScrollToTransactions,
}: {
  customer: Customer;
  onScrollToTransactions: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 p-2">
      <CardContent className="space-y-2 p-0">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Avatar className="h-8 w-8 ring-2 ring-accent">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                {getInitialsForAvatar(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 justify-between items-center">
              <h2 className="text-xl font-medium">{customer.name}</h2>
              <Badge variant="secondary">
                <User className="w-3 h-3 mr-1" />
                Müşteri #{customer.id}
              </Badge>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Adres</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{customer.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">E-posta</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Telefon</p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Building className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Vergi Dairesi</p>
              <p className="text-sm text-muted-foreground">{customer.taxOffice}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Hash className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Vergi Numarası</p>
              <p className="text-sm text-muted-foreground font-mono">{customer.taxNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Kayıt Tarihi</p>
              <p className="text-sm text-muted-foreground font-mono">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50 hover:bg-accent/50 transition-colors duration-200 border border-dashed">
            <ArrowRightLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Button onClick={onScrollToTransactions} className="gap-1 flex-1">
              <span className="text-sm flex items-center">
                Hareketler
                <SquareArrowOutUpRight className="ml-1 w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
