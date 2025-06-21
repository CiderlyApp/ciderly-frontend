// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress"; // Эта ошибка теперь должна исчезнуть

// Тип для хранения параметров одного пузырька
type Bubble = {
  id: number;
  size: string;
  left: string;
  animationDelay: string;
};

// Компонент для генерации анимированных пузырьков
const Bubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Генерируем пузырьки только на клиенте, чтобы избежать ошибок гидратации
  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: `${Math.random() * 8 + 2}px`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    
    setBubbles(generatedBubbles);
  }, []);

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            animationDelay: bubble.animationDelay,
          }}
        />
      ))}
    </>
  );
};


export default function LandingPage() {
  const finalReadiness = 67;
  const [progress, setProgress] = useState(0);

  const startColor = "#f97316";
  const endColor = "#22c55e";

  useEffect(() => {
    const timer = setTimeout(() => setProgress(finalReadiness), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-sans">
      <div className="w-full max-w-md">
        <h1 className="ciderly-title mb-4 text-center text-8xl font-extrabold tracking-tighter">
          CIDERLY
          <Bubbles />
        </h1>

        <div className="mb-2 flex justify-between text-sm font-medium text-muted-foreground">
          {/* Исправленный текст */}
          <span>Готовность</span>
          <span>{finalReadiness}%</span>
        </div>

        <Progress
          value={progress}
          indicatorStyle={{
            background: `linear-gradient(to right, ${startColor}, ${endColor})`,
          }}
        />
      </div>
    </main>
  );
}