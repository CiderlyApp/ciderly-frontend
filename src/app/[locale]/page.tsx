// FILE: src/app/[locale]/page.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bubbles } from '@/components/bubbles';
import { CommunityBubbles } from '@/components/visuals/community-bubbles';
import { AnimatedPhoneScene } from '@/components/animated-phone-scene';
import { AppStoreButton, GooglePlayButton } from '@/components/store-buttons';
import { Briefcase, Users, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], ['0px', '-50px']);
  const phoneY = useTransform(scrollYProgress, [0, 0.25], ["50vh", "0vh"]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [1.5, 1.7, 1.7, 0.8]);
  const phoneOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  const scrollButtonOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.9, 1], [0, 0, 1, 1, 0]);

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div ref={sceneRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute top-[20vh] left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center"
          >
            <div className="relative mb-8 text-7xl font-extrabold tracking-tighter sm:text-8xl md:text-9xl">
              <h1 className="ciderly-title-mask">
                CIDERLY
                <div className="ciderly-gradient-layer" />
                <div className="ciderly-bubbles-layer"><Bubbles /></div>
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Вся сидровая культура в вашем кармане.
            </p>
          </motion.div>

          <motion.div
            style={{ 
              y: phoneY, 
              scale: phoneScale, 
              opacity: phoneOpacity 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <AnimatedPhoneScene scrollYProgress={scrollYProgress} />
          </motion.div>

        </div>
      </div>
      
      {/* ✨ ИЗМЕНЕНИЯ В ЭТОЙ СЕКЦИИ ✨ */}
      <section ref={contentRef} className="relative bg-muted/50 py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-0 opacity-50"><CommunityBubbles /></div>
        
        {/* Уменьшаем вертикальные отступы с space-y-16 до space-y-12 для большей компактности */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-12 text-center">
          
          <div> {/* Оборачиваем в div для правильной работы space-y */}
            <div className="mb-4 flex justify-center text-primary"><Briefcase className="h-10 w-10" /></div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Вы производитель или владелец заведения?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Присоединяйтесь к Ciderly, чтобы управлять своим профилем, добавлять меню и получать ценную аналитику.</p>
            <div className="mt-8"><Button asChild size="lg" className="animate-pulse-shadow"><Link href="/for-business">Узнать больше и подать заявку</Link></Button></div>
          </div>
          
          <div> {/* Оборачиваем в div для правильной работы space-y */}
            <div className="mb-4 flex justify-center text-primary"><Users className="h-10 w-10" /></div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Присоединяйтесь к сообществу</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Следите за друзьями, делитесь впечатлениями и открывайте новые вкусы вместе с тысячами энтузиастов.</p>
          </div>
          
          {/* Кнопки теперь являются частью общего потока отступов */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row"><AppStoreButton /><GooglePlayButton /></div>
        </div>
      </section>

      <motion.div
        style={{ opacity: scrollButtonOpacity }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          size="icon"
          className="rounded-full h-14 w-14 animate-bounce"
          onClick={handleScrollDown}
          aria-label="Прокрутить к следующему экрану"
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </motion.div>
    </>
  );
}