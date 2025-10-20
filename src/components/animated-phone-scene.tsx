// src/components/animated-phone-scene.tsx
'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { Search, Camera, Calendar, Star, LayoutGrid, Bookmark } from 'lucide-react';
import { PhoneMockup } from '@/components/visuals/phone-mockup';

// ✨ ИЗМЕНЕНИЕ 1: Скорректированы конечные координаты (end.x), чтобы более широкие карточки не налезали друг на друга
const features = [
  { 
    icon: Search, 
    title: 'Умный поиск', 
    description: 'Ищите сидры, производителей, бары и магазины. Наша умная система поможет найти именно то, что вам нужно.',
    start: { x: 0, y: -200 }, 
    end: { x: -290, y: -280 } // Было: -220
  },
  { 
    icon: Camera, 
    title: 'Сканер этикеток', 
    description: 'Наведите камеру на этикетку или меню, чтобы мгновенно узнать рейтинг, отзывы и детали о любом сидре.',
    start: { x: 100, y: -200 }, 
    end: { x: 200, y: -280 } // Было: 187
  },
  { 
    icon: Calendar, 
    title: 'События и фестивали', 
    description: 'Интерактивная карта и календарь сидровых событий. Будьте в курсе всех дегустаций, фестивалей и презентаций.',
    start: { x: 0, y: -110 }, 
    end: { x: -320, y: -20 } // Было: -280
  },
  { 
    icon: Star, 
    title: 'Персональные рекомендации',
    description: 'Оценивайте сидры, а наш алгоритм создаст ваш вкусовой профиль и предложит напитки, которые вам точно понравятся.',
    start: { x: 0, y: 120 }, 
    end: { x: 300, y: 0 } // Было: 238
  },
  { 
    icon: LayoutGrid, 
    title: 'Лента активности',
    description: 'Следите за отзывами и чекинами ваших друзей и лидеров мнений. Узнавайте первыми о новых интересных сидрах.',
    start: { x: -80, y: 260 }, 
    end: { x: -280, y: 170 } // Было: -220
  },
  { 
    icon: Bookmark, 
    title: 'Коллекции и избранное',
    description: 'Создавайте вишлисты, ведите учет своей коллекции и отмечайте любимые сидры, чтобы никогда их не забыть.',
    start: { x: 80, y: 260 }, 
    end: { x: 250, y: 180 } // Было: 187
  },
];

const AnimatedCard = ({ feature, scrollYProgress }: { feature: typeof features[0], scrollYProgress: MotionValue<number> }) => {
  const x = useTransform(scrollYProgress, [0.2, 0.4], [feature.start.x, feature.end.x]);
  const y = useTransform(scrollYProgress, [0.2, 0.4], [feature.start.y, feature.end.y]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.2, 0.35], [0.5, 1]);

  return (
    // ✨ ИЗМЕНЕНИЕ 2: Карточка стала шире (w-60) и получила больше внутреннего отступа (p-4)
    <motion.div style={{ x, y, opacity, scale }} className="absolute top-1/2 left-1/2 flex w-60 flex-col items-center rounded-xl border bg-card p-4 text-center shadow-lg">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><feature.icon className="h-5 w-5" /></div>
      <h3 className="text-sm font-semibold">{feature.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>
    </motion.div>
  );
};

export const AnimatedPhoneScene = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  return (
    <div className="relative h-[600px] w-[300px]">
      <PhoneMockup />
      <div className="absolute inset-0">
        {features.map((feature, index) => (
          <AnimatedCard key={index} feature={feature} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
};