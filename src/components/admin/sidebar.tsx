// src/components/admin/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
// --- ИЗМЕНЕНИЕ: Заменили иконку Beer на Wine ---
import { Users, ShieldCheck, ShoppingBag, BarChart3, Building, LogOut, Wine } from 'lucide-react';
import { Button } from '../ui/button';

// --- НОВОЕ: Указываем версию админки ---
const ADMIN_VERSION = "0.1.1";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  // Используем startsWith для подсветки активного раздела, кроме дашборда
  const pathname = usePathname();
  const isActive = href === '/admin' ? pathname === href : pathname.startsWith(href);
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
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      {/* --- ИЗМЕНЕНИЕ: Обновили блок заголовка --- */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Wine className="h-6 w-6" /> {/* <-- Новая иконка */}
          <span>Ciderly Admin</span>
        </Link>
      </div>
      {/* ------------------------------------------- */}
      
      <div className="flex flex-1 flex-col justify-between">
        <nav className="p-4">
          <ul className="space-y-1">
            {/* ... (список ссылок без изменений) ... */}
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

        <div className="mt-auto p-4 border-t">
            {/* --- НОВОЕ: Добавили номер версии --- */}
            <div className="mb-2 text-center text-xs text-muted-foreground">
              Версия: {ADMIN_VERSION}
            </div>
            {/* --------------------------------- */}
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выход
            </Button>
        </div>
      </div>
    </aside>
  );
}