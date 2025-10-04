// src/app/admin/places/columns.tsx
"use client"

// --- ИСПРАВЛЕНИЕ: Удален 'useState' из импорта ---
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Place } from "@/types/entities"
import { useModeratePlace, useArchivePlace } from "@/hooks/use-places"
import Link from 'next/link';
// Компонент для меню действий
const ActionsCell = ({ row }: { row: { original: Place } }) => {
  const place = row.original;
  const { mutate: moderatePlace, isPending: isModerating } = useModeratePlace();
  const { mutate: archivePlace, isPending: isArchiving } = useArchivePlace();
  
  const isPending = place.status === 'PENDING';

  return (
    <AlertDialog>
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
            <Link href={`/admin/places/${place.id}/edit`}>Редактировать</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {isPending && (
            <DropdownMenuItem onClick={() => moderatePlace({ placeId: place.id, status: 'APPROVED' })} disabled={isModerating}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Одобрить
            </DropdownMenuItem>
          )}

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive" disabled={isArchiving}>
              <Trash2 className="mr-2 h-4 w-4" />
              Архивировать
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            {`Это действие заархивирует место "${place.name}". Оно перестанет отображаться для пользователей.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => archivePlace(place.id)} className="bg-destructive hover:bg-destructive/90">
            Да, архивировать
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const columns: ColumnDef<Place>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "city",
    header: "Город",
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status") as Place['status'];
      const variant: "default" | "secondary" | "destructive" | "outline" =
        status === 'APPROVED' ? 'default' :
        status === 'REJECTED' ? 'destructive' :
        status === 'ARCHIVED' ? 'secondary' :
        'outline';
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "averageRating",
    header: "Рейтинг",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("averageRating") || '0');
      return rating > 0 ? rating.toFixed(1) : 'N/A';
    }
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString("ru-RU"),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]