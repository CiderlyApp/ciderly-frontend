// src/app/admin/reports/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Report, useProcessReport } from "@/hooks/use-reports"

const ActionsCell = ({ row }: { row: { original: Report } }) => {
  const report = row.original;
  const { mutate: processReport, isPending } = useProcessReport();

  if (report.status !== 'PENDING') {
    return null; // Нет действий для уже обработанных
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Меню</span><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Обработать жалобу</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => processReport({ reportId: report.id, action: 'RESOLVED' })} disabled={isPending}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Принять (Скрыть отзыв)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => processReport({ reportId: report.id, action: 'DISMISSED' })} disabled={isPending}>
          <XCircle className="mr-2 h-4 w-4 text-destructive" /> Отклонить жалобу
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Report>[] = [
  { accessorKey: "reason", header: "Причина", cell: ({ row }) => <Badge variant="destructive">{row.getValue("reason")}</Badge> },
  { accessorKey: "comment", header: "Комментарий пользователя", cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("comment") || "-"}</div> },
  { accessorKey: "reviewType", header: "Тип отзыва" },
  { accessorKey: "reporterNickname", header: "Пожаловался" },
  { accessorKey: "createdAt", header: "Дата", cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString("ru-RU")},
  { id: "actions", cell: ActionsCell },
]