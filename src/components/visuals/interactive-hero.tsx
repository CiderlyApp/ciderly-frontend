// src/components/interactive-hero.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wine, MapPin, Calendar, ScanLine } from 'lucide-react';
import { PhoneMockup } from '@/components/visuals/phone-mockup';
import { Bubbles } from '@/components/bubbles';
// Данные для наших "вылетающих" карточек
const features = [
  {
    icon: Wine,
    title: 'Находите лучшие сидры',
    description: 'Огромная база, пополняемая сообществом. Умный поиск по названию, стилю и производителю.',
    // [x, y] - финальная позиция в % от ширины/высоты контейнера
    endPosition: [-35, -20], 
  },
  {
    icon: MapPin,
    title: 'Исследуйте места',
    description: 'Интерактивная карта баров, магазинов и сидрерий. Читайте отзывы и смотрите меню.',
    endPosition: [35, -20],
  },
  {
    icon: Calendar,
    title: 'Будьте в курсе событий',
    description: 'Не пропустите фестивали, дегустации и презентации новых сортов в вашем городе.',
    endPosition: [-35, 20],
  },
  {
    icon: ScanLine,
    title: 'Распознавание по этикетке',
    description: 'Наш ИИ узнает сидр по фото этикетки и даже найдет напитки в меню бара. Вся информация в одно касание.',
    endPosition: [35, 20],
  },
];

// Компонент для одной карточки
const AnimatedFeatureCard = ({ feature, scrollYProgress }: { feature: typeof features[0], scrollYProgress: any }) => {
  // Трансформируем значение скролла (от 0 до 1) в анимацию
  const x = useTransform(scrollYProgress, [0.1, 0.8], [0, feature.endPosition[0]]);
  const y = useTransform(scrollYProgress, [0.1, 0.8], [0, feature.endPosition[1]]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);

  return (
    <motion.div
      style={{ x: `${x}%`, y: `${y}%`, opacity, scale }}
      className="absolute top-1/2 left-1/2 flex w-64 origin-center flex-col items-center rounded-xl border bg-card p-4 text-center shadow-lg"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <feature.icon className="h-7 w-7" />
      </div>
      <h3 className="mb-1 text-md font-semibold">{feature.title}</h3>
      <p className="text-muted-foreground text-xs">{feature.description}</p>
    </motion.div>
  );
};

export const InteractiveHero = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  // Отслеживаем прогресс скролла внутри контейнера targetRef
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Анимация для телефона: немного уменьшается при скролле
  const phoneScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const phoneOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    // Контейнер, который определяет "длительность" скролла для анимации
    <section ref={targetRef} className="relative h-[300vh] py-20">
      {/* Этот контейнер "прилипает" к верху экрана на время прокрутки */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        
        {/* Заголовок (остается статичным) */}
        <div className="relative z-20 mb-8 text-center">
          <h1 className="ciderly-title-mask text-7xl font-extrabold tracking-tighter sm:text-8xl md:text-9xl">
            CIDERLY
            <div className="ciderly-gradient-layer"></div>
            <div className="ciderly-bubbles-layer">
              <Bubbles />
            </div>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Вся сидровая культура в вашем кармане. Открывайте, оценивайте и делитесь лучшими сидрами, местами и событиями.
          </p>
        </div>

        {/* Сцена с анимацией */}
        <div className="relative flex h-[500px] w-full items-center justify-center">
            {/* Карточки */}
            {features.map((feature, index) => (
                <AnimatedFeatureCard key={index} feature={feature} scrollYProgress={scrollYProgress} />
            ))}

            {/* Телефон */}
            <motion.div style={{ scale: phoneScale, opacity: phoneOpacity }} className="relative z-10">
                <PhoneMockup />
            </motion.div>
        </div>

      </div>
    </section>
  );
};