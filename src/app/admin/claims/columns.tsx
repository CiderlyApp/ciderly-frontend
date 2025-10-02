// src/app/admin/claims/columns.tsx
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProcessClaim, Claim } from "@/hooks/use-claims" // <-- Импортируем хук и тип


// Компонент для меню действий
const ActionsCell = ({ row }: { row: { original: Claim } }) => {
  const claim = row.original;
  const { mutate: processClaim, isPending } = useProcessClaim();
  
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    if (isPending) return;
    processClaim({ claimId: claim.id, action: 'approve' });
  };
  
  const handleReject = () => {
    if (isPending || !rejectReason.trim()) return;
    processClaim({ claimId: claim.id, action: 'reject', adminComment: rejectReason }, {
        onSuccess: () => setIsRejectDialogOpen(false) // Закрываем диалог при успехе
    });
  };

  return (
    <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={claim.status !== 'PENDING'}>
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleApprove} disabled={isPending}>
            Одобрить
          </DropdownMenuItem>
          <DialogTrigger asChild>
  <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()} disabled={isPending} className="text-destructive focus:text-destructive">
    Отклонить
  </DropdownMenuItem>
</DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Отклонить заявку #{claim.id.substring(0, 8)}</DialogTitle>
          <DialogDescription>
            Укажите причину отклонения. Пользователь увидит этот комментарий.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="reason">Причина отклонения</Label>
          <Textarea
            id="reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Например, недостаточно доказательств владения..."
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>Отмена</Button>
          <Button variant="destructive" onClick={handleReject} disabled={isPending || !rejectReason.trim()}>
            {isPending ? "Отклонение..." : "Отклонить заявку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const columns: ColumnDef<Claim>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue<string>("id").substring(0, 8)}...</div>,
  },
  {
    accessorKey: "userNickname",
    header: "Пользователь",
  },
  {
    accessorKey: "entityType",
    header: "Тип",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("entityType")}</Badge>
  },
  {
    accessorKey: "entityName",
    header: "Сущность",
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status") as Claim['status'];
      const variant: "default" | "secondary" | "destructive" | "outline" =
        status === 'APPROVED' ? 'default' :
        status === 'REJECTED' ? 'destructive' :
        'outline';
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString("ru-RU"),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]