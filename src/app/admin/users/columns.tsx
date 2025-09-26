// src/app/admin/users/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useUpdateUserBlockStatus } from "@/hooks/use-users";

// Определяем тип данных для пользователя
export type User = {
  id: string
  nickname: string
  email: string
  role: 'user' | 'moderator' | 'business' | 'admin'
  isBlocked: boolean
  createdAt: string
}

// Компонент для меню действий, чтобы он мог использовать хуки
const ActionsCell = ({ row }: { row: { original: User } }) => {
  const user = row.original;
  const { mutate: updateBlockStatus, isPending } = useUpdateUserBlockStatus();

  const handleBlockToggle = () => {
    if (isPending) return;
    updateBlockStatus({ userId: user.id, isBlocked: !user.isBlocked });
  }

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
          Копировать ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Изменить роль</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleBlockToggle}
          className={user.isBlocked ? "text-green-600 focus:text-green-700" : "text-destructive focus:text-destructive"}
          disabled={isPending}
        >
          {isPending ? 'Обновление...' : (user.isBlocked ? 'Разблокировать' : 'Заблокировать')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
            role === 'moderator' ? 'secondary' :
            'default';
        return <Badge variant={variant}>{role}</Badge>
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