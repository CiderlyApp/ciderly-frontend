'use client';

import { useState, useEffect, memo } from 'react';

type Bubble = {
  id: number;
  size: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

const BubblesComponent = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    
    // 1. Увеличиваем количество на 20% (было 15, стало 18)
    const bubbleCount = 118; 
    
    const generatedBubbles = Array.from({ length: bubbleCount }).map((_, i) => {
      
      // 2. Уменьшаем размер на 20% (был диапазон 2-10px, стал 1.6-8px)
      //    Формула: Math.random() * (max - min) + min
      const size = Math.random() * 3.4 + 0.6; // Диапазон от 1.6px до 8px
      
      return {
        id: i,
        size: `${size}px`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 5 + 3}s`,
      };
    });

    setBubbles(generatedBubbles);
  }, []);

  return (
    <>
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            animationDelay: b.animationDelay,
            animationDuration: b.animationDuration,
          }}
        />
      ))}
    </>
  );
};

export const Bubbles = memo(BubblesComponent);