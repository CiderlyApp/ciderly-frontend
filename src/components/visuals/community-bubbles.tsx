// FILE: src/components/visuals/community-bubbles.tsx
'use client';

import { useState, useEffect, memo } from 'react';

type Bubble = {
  id: number;
  size: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
};

const CommunityBubblesComponent = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const bubbleCount = 30;
    const generatedBubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 60 + 20, // 20-80px
      left: Math.random() * 100,
      top: Math.random() * 100, // Стартуют со всей площади
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 8 + 12, // 12-20 секунд
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-accent/5 to-primary/5">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full bg-white/40 shadow-lg community-bubble-float"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            top: `${b.top}%`,
            animationDelay: `${b.animationDelay}s`,
            animationDuration: `${b.animationDuration}s`,
            backdropFilter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );
};

export const CommunityBubbles = memo(CommunityBubblesComponent);