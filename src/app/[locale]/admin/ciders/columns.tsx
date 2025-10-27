// src/app/admin/ciders/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Cider } from "@/types/entities"
import { useDeleteCider } from "@/hooks/use-ciders";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


const ActionsCell = ({ row }: { row: { original: Cider } }) => {
  const cider = row.original;
  const { mutate: deleteCider, isPending } = useDeleteCider();

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
            <Link href={`/admin/ciders/${cider.id}/edit`}>Редактировать</Link>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive" disabled={isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            {`Это действие навсегда удалит напиток "${cider.name}". Это действие нельзя отменить.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteCider(cider.id)} className="bg-destructive hover:bg-destructive/90">
            Да, удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const columns: ColumnDef<Cider>[] = [
  { accessorKey: "name", header: "Название" },
  { accessorKey: "manufacturerName", header: "Производитель" },
  { accessorKey: "type", header: "Тип" },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status") as Cider['status'];
      const variant = status === 'APPROVED' ? 'default' : 'outline';
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  { id: "actions", cell: ActionsCell },
]