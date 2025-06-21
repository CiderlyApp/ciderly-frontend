'use client';

import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

// --- Компонент анимированных пузырьков ---
type Bubble = { id: number; size: string; left: string; animationDelay: string; };
const Bubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i, size: `${Math.random() * 8 + 2}px`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);
  return <>{bubbles.map(b => <div key={b.id} className="bubble" style={b} />)}</>;
};


// --- Основной компонент страницы ---
export default function LandingPage() {
  const finalReadiness = 67;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(finalReadiness), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      
      <div className="w-full max-w-2xl text-center">
        <h1 className="ciderly-title mx-auto mb-8 text-8xl font-extrabold tracking-tighter">
          CIDERLY
          <Bubbles />
        </h1>

        <div className="w-full">
          <div className="mb-2 flex justify-between text-sm font-medium text-muted-foreground">
            <span>Готовность</span>
            <span>{finalReadiness}%</span>
          </div>
          <Progress
            value={progress}
            indicatorStyle={{
              background: `linear-gradient(to right, #f97316, #3b82f6)`,
            }}
            ticks={[25, 50, 75]}
          />
        </div>
      </div>

    </div>
  );
}