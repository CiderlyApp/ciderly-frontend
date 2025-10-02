// src/components/admin/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Users, ShieldCheck, ShoppingBag, BarChart3, Building, Beer, LogOut } from 'lucide-react'; // <-- Добавили иконку LogOut
import { Button } from '../ui/button';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href); // Используем startsWith для активных под-путей
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      {children}
    </Link>
  );
};

export function Sidebar() {
  const { user, logout } = useAuth(); // <-- Получаем функцию logout из контекста

  if (!user) return null;

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Beer className="h-6 w-6" />
          <span>Ciderly Admin</span>
        </Link>
      </div>
      
      {/* --- ИЗМЕНЕНИЕ: Добавляем flex-grow и flex-col для основного блока --- */}
      <div className="flex flex-1 flex-col justify-between">
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <NavLink href="/admin">
                <BarChart3 className="h-4 w-4" />
                Дашборд
              </NavLink>
            </li>
            
            {user.role === 'admin' && (
              <li>
                <NavLink href="/admin/users">
                  <Users className="h-4 w-4" />
                  Пользователи
                </NavLink>
              </li>
            )}
            
            {/* --- ИЗМЕНЕНИЕ: Ссылка на заявки для админов и модераторов --- */}
            {(user.role === 'admin' || user.role === 'moderator') && (
              <li>
                <NavLink href="/admin/claims">
                  <ShieldCheck className="h-4 w-4" />
                  Заявки
                </NavLink>
              </li>
            )}
            
            {(user.role === 'admin' || user.role === 'moderator' || user.role === 'business') && (
              <>
                <li>
                  <NavLink href="/admin/places">
                    <ShoppingBag className="h-4 w-4" />
                    Места
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/admin/manufacturers">
                    <Building className="h-4 w-4" />
                    Производители
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* --- НОВОЕ: Блок для кнопки выхода --- */}
        <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выход
            </Button>
        </div>
      </div>
    </aside>
  );
}