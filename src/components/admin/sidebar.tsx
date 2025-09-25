// src/components/admin/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Users, ShieldCheck, ShoppingBag, BarChart3, Building, Beer } from 'lucide-react'; // Иконки

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
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
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Beer className="h-6 w-6" />
          <span>Ciderly Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink href="/admin">
              <BarChart3 className="h-4 w-4" />
              Дашборд
            </NavLink>
          </li>
          
          {/* Ссылки только для Админов */}
          {user.role === 'admin' && (
            <li>
              <NavLink href="/admin/users">
                <Users className="h-4 w-4" />
                Пользователи
              </NavLink>
            </li>
          )}
          
          {/* Ссылки для Админов и Модераторов */}
          {(user.role === 'admin' || user.role === 'moderator') && (
            <li>
              <NavLink href="/admin/claims">
                <ShieldCheck className="h-4 w-4" />
                Заявки
              </NavLink>
            </li>
          )}
          
          {/* Ссылки для Бизнеса (и админов/модераторов) */}
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
    </aside>
  );
}