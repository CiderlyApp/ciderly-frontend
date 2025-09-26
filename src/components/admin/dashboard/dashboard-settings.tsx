// src/components/admin/dashboard/dashboard-settings.tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Widget } from "@/hooks/use-dashboard-layout";

interface DashboardSettingsProps {
  children: React.ReactNode;
  widgets: Widget[];
  onToggle: (widgetId: string) => void;
}

export function DashboardSettings({ children, widgets, onToggle }: DashboardSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{children}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Настройка дашборда</SheetTitle>
          <SheetDescription>
            Включайте, выключайте и перетаскивайте виджеты для настройки рабочего пространства.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center justify-between">
              <Label htmlFor={`switch-${widget.id}`} className="flex-1">
                {widget.name}
              </Label>
              <Switch
                id={`switch-${widget.id}`}
                checked={widget.visible}
                onCheckedChange={() => onToggle(widget.id)}
              />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}