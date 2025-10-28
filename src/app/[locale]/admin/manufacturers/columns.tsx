// src/app/[locale]/admin/manufacturers/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { MoreHorizontal, Archive, ArchiveRestore } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Manufacturer } from "@/types/entities"
import { Badge } from "@/components/ui/badge" // <-- Импорт Badge
import { useUpdateManufacturerStatus } from "@/hooks/use-manufacturers"; 

const ActionsCell = ({ row }: { row: { original: Manufacturer } }) => {
  const manufacturer = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Открыть меню</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Действия</DropdownMenuLabel>
        <DropdownMenuItem asChild>
            <Link href={`/admin/manufacturers/${manufacturer.id}/edit`}>Редактировать</Link>
        </DropdownMenuItem>
        {/* Здесь можно будет добавить "Удалить", "Управление персоналом" и т.д. */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Manufacturer>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "isClosed",
    header: "Статус",
    cell: ({ row }) => {
      const isClosed = row.getValue("isClosed");
      return isClosed
        ? <Badge variant="outline">Закрыт</Badge>
        : <Badge variant="secondary" className="bg-green-100 text-green-800">Активен</Badge>
    }
  },

  {
    accessorKey: "city",
    header: "Город",
    cell: ({ row }) => row.getValue("city") || <span className="text-muted-foreground">Не указан</span>
  },
  {
    accessorKey: "countryName",
    header: "Страна",
  },
  {
    accessorKey: "subscribersCount",
    header: "Подписчики",
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]