// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Bubbles } from '@/components/bubbles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/login-form';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const FINAL_READINESS = 73;

export default function LandingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(FINAL_READINESS), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      
      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 z-20 w-full p-6 flex items-center justify-between">
        

        {/* Навигация */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Блог</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Приложение</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
          </ul>
        </nav>

        {/* Кнопка входа */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 p-2">
              <LogIn className="h-6 w-6" />
              <span className="sr-only">Войти</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 sm:max-w-[850px] border-0 overflow-hidden">
            <LoginForm />
          </DialogContent>
        </Dialog>
      </header>

      {/* --- ОСНОВНОЙ КОНТЕНТ (ЦЕНТР) --- */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-2xl text-center">
          
          <div className="relative mb-8 text-8xl font-extrabold tracking-tighter">
            <h1 className="ciderly-title-mask">
              CIDERLY 
              <div className="ciderly-gradient-layer"></div>
              <div className="ciderly-bubbles-layer">
                <Bubbles />
              </div>
            </h1>
          </div>

          <div className="w-full">
            <div className="mb-2 flex justify-between text-sm font-medium text-muted-foreground">
              <span id="progress-label">Готовность</span>
              <span>{FINAL_READINESS}%</span>
            </div>
            <Progress
              value={progress}
              aria-labelledby="progress-label"
              indicatorStyle={{
                background: `linear-gradient(to right, #8B5CF6, #F97316, #10B981)`,
              }}
              ticks={[25, 50, 75]}
            />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t bg-background">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12 text-sm">
    <div className="flex flex-col gap-3">
      <h4 className="font-semibold">Навигация</h4>
      <Link href="/blog" className="text-muted-foreground hover:text-foreground">Блог</Link>
      <Link href="/app" className="text-muted-foreground hover:text-foreground">Приложение</Link>
      <Link href="/contacts" className="text-muted-foreground hover:text-foreground">Контакты</Link>
    </div>

    <div className="flex flex-col gap-3">
      <h4 className="font-semibold">Для бизнеса</h4>
      <Link href="/claim-business" className="text-muted-foreground hover:text-foreground">Подать заявку</Link>
      <Link href="/feedback" className="text-muted-foreground hover:text-foreground">Обратная связь</Link>
    </div>

    <div className="flex flex-col gap-3">
      <h4 className="font-semibold">Правовая информация</h4>
      <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Политика конфиденциальности</Link>
      <Link href="/terms" className="text-muted-foreground hover:text-foreground">Условия использования</Link>
    </div>

    <div className="flex flex-col gap-3">
      <h4 className="font-semibold text-lg">Ciderly</h4>
      <p className="text-muted-foreground">
        Ваш гид в мире сидра. Открывайте, оценивайте, делитесь.
      </p>
      <span className="text-muted-foreground">&copy; Ciderly {new Date().getFullYear()}</span>
    </div>
  </div>
</footer>
    </div>
  );
}