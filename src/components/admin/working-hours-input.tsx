// src/components/admin/working-hours-input.tsx
'use client';

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DayStatus = 'open' | 'closed';

type DayWorkingHours = {
  status: DayStatus;
  open?: string;
  close?: string;
};

type WorkingHours = {
  [key: string]: DayWorkingHours;
};

interface WorkingHoursInputProps {
  value?: WorkingHours;
  onChange: (value: WorkingHours) => void;
}

const daysOfWeek = [
  { key: 'monday', name: 'Понедельник' },
  { key: 'tuesday', name: 'Вторник' },
  { key: 'wednesday', name: 'Среда' },
  { key: 'thursday', name: 'Четверг' },
  { key: 'friday', name: 'Пятница' },
  { key: 'saturday', name: 'Суббота' },
  { key: 'sunday', name: 'Воскресенье' },
];

export function WorkingHoursInput({ value = {}, onChange }: WorkingHoursInputProps) {

  const handleDayChange = (dayKey: string, field: keyof DayWorkingHours, fieldValue: string) => {
    const updatedDay = { ...(value[dayKey] || { status: 'closed' }), [field]: fieldValue };
    if (field === 'status' && fieldValue === 'closed') {
        delete updatedDay.open;
        delete updatedDay.close;
    }
    onChange({ ...value, [dayKey]: updatedDay });
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      {daysOfWeek.map(day => {
        const dayValue = value[day.key] || { status: 'closed' };
        const isOpen = dayValue.status === 'open';

        return (
          <div key={day.key} className="grid grid-cols-3 md:grid-cols-4 items-center gap-2 md:gap-4">
            <Label className="md:col-span-1">{day.name}</Label>
            <Select
              value={dayValue.status}
              onValueChange={(newStatus) => handleDayChange(day.key, 'status', newStatus)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Открыто</SelectItem>
                <SelectItem value="closed">Закрыто</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="time"
              value={dayValue.open || ''}
              onChange={(e) => handleDayChange(day.key, 'open', e.target.value)}
              disabled={!isOpen}
              className={cn(!isOpen && "opacity-50")}
            />
            <Input
              type="time"
              value={dayValue.close || ''}
              onChange={(e) => handleDayChange(day.key, 'close', e.target.value)}
              disabled={!isOpen}
              className={cn(!isOpen && "opacity-50")}
            />
          </div>
        )
      })}
    </div>
  );
}