// src/components/admin/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, ShieldCheck, ShoppingBag, Building, LogOut, Wine, GlassWater, MessageSquare, ShieldAlert, Star } from 'lucide-react'; // <-- Добавляем Star
import { Button } from '../ui/button';

const ADMIN_VERSION = "0.3.5";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
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
      {/* Заголовок */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Wine className="h-6 w-6" />
          <span>Ciderly Admin</span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <NavLink href="/admin">
                <LayoutDashboard className="h-4 w-4" />
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
              <>
                <li>
                  <NavLink href="/admin/claims">
                    <ShieldCheck className="h-4 w-4" />
                    Заявки
                  </NavLink>
                </li>
                {/* Ссылка на отзывы */}
                <li>
                  <NavLink href="/admin/reviews">
                    <MessageSquare className="h-4 w-4" />
                    Отзывы
                  </NavLink>
                </li>
                {/* Ссылка на жалобы */}
                <li>
                  <NavLink href="/admin/reports">
                    <ShieldAlert className="h-4 w-4" />
                    Жалобы
                  </NavLink>
                </li>
              </>
            )}
            
            {(user.role === 'admin' || user.role === 'moderator' || user.role === 'business') && (
              <>
                <li>
                  <NavLink href="/admin/places">
                    <Building className="h-4 w-4" />
                    Места
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/admin/manufacturers">
                    <Building className="h-4 w-4" />
                    Производители
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/admin/ciders">
                    <GlassWater className="h-4 w-4" />
                    Напитки
                  </NavLink>
                </li>
              </>
            )}

            {/* Ссылка только для роли business */}
            {user.role === 'business' && (
              <li>
                <NavLink href="/admin/my-reviews">
                  <Star className="h-4 w-4" />
                  Мои Отзывы
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t">
          {/* Версия админ-панели */}
          <div className="mb-2 text-center text-xs text-muted-foreground">
            Версия: {ADMIN_VERSION}
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выход
          </Button>
        </div>
      </div>
    </aside>
  );
}