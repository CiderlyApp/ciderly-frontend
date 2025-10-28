// src/app/admin/reviews/columns.tsx
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModerationReview, useModerateReview } from "@/hooks/use-reviews"

const ActionsCell = ({ row }: { row: { original: ModerationReview } }) => {
  const review = row.original;
  const { mutate: moderate, isPending } = useModerateReview();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [comment, setComment] = useState("");

  if (review.status !== 'PENDING') return null;

  const handleReject = () => {
    // --- ИСПОЛЬЗУЕМ camelCase ---
    moderate({ reviewId: review.id, reviewType: review.reviewType, status: 'REJECTED', moderationComment: comment }, {
      onSuccess: () => setIsRejectOpen(false)
    });
  };

  const handleApprove = () => {
    // --- ИСПОЛЬЗУЕМ camelCase ---
    moderate({ reviewId: review.id, reviewType: review.reviewType, status: 'APPROVED' });
  };

  return (
    <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Модерация</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleApprove} disabled={isPending}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Одобрить
          </DropdownMenuItem>
          <DialogTrigger asChild><DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive focus:text-destructive"><XCircle className="mr-2 h-4 w-4" /> Отклонить</DropdownMenuItem></DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader><DialogTitle>Причина отклонения отзыва</DialogTitle></DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="comment">Комментарий для пользователя</Label>
          <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsRejectOpen(false)}>Отмена</Button>
          <Button variant="destructive" onClick={handleReject} disabled={isPending}>{isPending ? "Отклонение..." : "Отклонить"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const columns: ColumnDef<ModerationReview>[] = [
  // --- ИСПОЛЬЗУЕМ camelCase ВЕЗДЕ ---
  { accessorKey: "reviewType", header: "Тип", cell: ({ row }) => <Badge variant="outline">{row.getValue("reviewType")}</Badge> },
  { accessorKey: "entityName", header: "Объект отзыва" },
  { accessorKey: "userNickname", header: "Автор" },
  { accessorKey: "commentText", header: "Текст", cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("commentText") || "Без текста"}</div> },
  { accessorKey: "rating", header: "Оценка" },
  { id: "actions", cell: ActionsCell },
];