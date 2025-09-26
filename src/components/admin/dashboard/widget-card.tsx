// src/components/admin/dashboard/widget-card.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import React from "react";

interface WidgetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const WidgetCard = React.forwardRef<HTMLDivElement, WidgetCardProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("flex flex-col", className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <button className="cursor-grab active:cursor-grabbing text-muted-foreground">
            <GripVertical className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="flex-1">
          {children}
        </CardContent>
      </Card>
    );
  }
);
WidgetCard.displayName = "WidgetCard";