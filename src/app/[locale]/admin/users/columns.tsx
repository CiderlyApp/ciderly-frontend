// src/app/admin/users/columns.tsx
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useUpdateUserBlockStatus, useUpdateUserRole } from "@/hooks/use-users" // <-- Добавили useUpdateUserRole

export type User = {
  id: string
  nickname: string
  email: string
  role: 'user' | 'moderator' | 'business' | 'admin' | 'blogger'
  isBlocked: boolean
  createdAt: string
}

const ActionsCell = ({ row }: { row: { original: User } }) => {
  const user = row.original;
  const { mutate: updateBlockStatus, isPending: isBlockPending } = useUpdateUserBlockStatus();
  // --- НОВОЕ ---
  const { mutate: updateUserRole, isPending: isRolePending } = useUpdateUserRole();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<User['role']>(user.role);

  const handleBlockToggle = () => {
    if (isBlockPending) return;
    updateBlockStatus({ userId: user.id, isBlocked: !user.isBlocked });
  }

  const handleRoleChange = () => {
    if (isRolePending || selectedRole === user.role) return;
    updateUserRole({ userId: user.id, newRole: selectedRole }, {
      onSuccess: () => setIsRoleDialogOpen(false) // Закрываем диалог при успехе
    });
  }

  return (
    <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
            Копировать ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* --- ИЗМЕНЕНИЕ: Теперь это триггер для Dialog --- */}
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Изменить роль</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={handleBlockToggle}
            className={user.isBlocked ? "text-green-600 focus:text-green-700" : "text-destructive focus:text-destructive"}
            disabled={isBlockPending}
          >
            {isBlockPending ? 'Обновление...' : (user.isBlocked ? 'Разблокировать' : 'Заблокировать')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* --- НОВОЕ: Содержимое диалога для смены роли --- */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить роль для {user.nickname}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Роль</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as User['role'])}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="blogger">Blogger</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsRoleDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleRoleChange} disabled={isRolePending || selectedRole === user.role}>
            {isRolePending ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "nickname",
    header: "Никнейм",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Роль",
cell: ({ row }) => {
        const role = row.getValue("role") as User['role'];
        const variant: "default" | "secondary" | "destructive" | "outline" = 
            role === 'admin' ? 'destructive' :
            role === 'moderator' || role === 'business' ? 'secondary' :
            role === 'blogger' ? 'default' : 
            'outline';
        const className = role === 'blogger' ? 'bg-purple-600 text-white' : ''; 
        return <Badge variant={variant} className={className}>{role}</Badge>
    }
  },
  {
    accessorKey: "isBlocked",
    header: "Статус",
    cell: ({ row }) => {
        const isBlocked = row.getValue("isBlocked");
        return isBlocked ? <Badge variant="outline">Заблокирован</Badge> : <span className="text-green-600">Активен</span>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Дата регистрации",
    cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString("ru-RU")}</div>
    }
  },
  {
    id: "actions",
    cell: ActionsCell, 
  },
]