// src/app/[locale]/page.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bubbles } from '@/components/bubbles';
import { CommunityBubbles } from '@/components/visuals/community-bubbles';
import { AnimatedPhoneScene } from '@/components/animated-phone-scene';
import { AppStoreButton, GooglePlayButton } from '@/components/store-buttons';
import { Briefcase, Users, ChevronDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { PhoneMockup } from '@/components/visuals/phone-mockup';

// Компонент для десктопной версии с полной анимацией
const DesktopHero = () => {
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
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div ref={sceneRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute top-[20vh] left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center">
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
          <motion.div style={{ y: phoneY, scale: phoneScale, opacity: phoneOpacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AnimatedPhoneScene scrollYProgress={scrollYProgress} />
          </motion.div>
        </div>
      </div>
      <motion.div style={{ opacity: scrollButtonOpacity }} className="fixed bottom-8 right-8 z-50">
        <Button size="icon" className="rounded-full h-14 w-14 animate-bounce" onClick={handleScrollDown} aria-label="Прокрутить к следующему экрану">
          <ChevronDown className="h-8 w-8" />
        </Button>
      </motion.div>
      <section ref={contentRef} className="relative bg-muted/50 py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        {/* ... остальной контент без изменений ... */}
        <div className="absolute inset-0 -z-0 opacity-50"><CommunityBubbles /></div>
        <div className="relative z-10 mx-auto max-w-4xl space-y-12 text-center">
          <div>
            <div className="mb-4 flex justify-center text-primary"><Briefcase className="h-10 w-10" /></div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Вы производитель или владелец заведения?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Присоединяйтесь к Ciderly, чтобы управлять своим профилем, добавлять меню и получать ценную аналитику.</p>
            <div className="mt-8"><Button asChild size="lg" className="animate-pulse-shadow"><Link href="/for-business">Узнать больше и подать заявку</Link></Button></div>
          </div>
          <div>
            <div className="mb-4 flex justify-center text-primary"><Users className="h-10 w-10" /></div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Присоединяйтесь к сообществу</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Следите за друзьями, делитесь впечатлениями и открывайте новые вкусы вместе с тысячами энтузиастов.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row"><AppStoreButton /><GooglePlayButton /></div>
        </div>
      </section>
    </>
  );
};

// Компонент для мобильной версии - статичный и быстрый
const MobileHero = () => {
  return (
    <>
      <section className="flex h-screen flex-col justify-center items-center text-center px-4 -mt-14">
        <div className="relative mb-6 text-6xl font-extrabold tracking-tighter">
          <h1 className="ciderly-title-mask">
            CIDERLY
            <div className="ciderly-gradient-layer" />
            <div className="ciderly-bubbles-layer"><Bubbles /></div>
          </h1>
        </div>
        <p className="mx-auto max-w-md text-md text-muted-foreground">
          Вся сидровая культура в вашем кармане.
        </p>
        <div className="mt-8 scale-75">
            <PhoneMockup />
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AppStoreButton />
            <GooglePlayButton />
        </div>
      </section>
       <section className="relative bg-muted/50 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-0 opacity-50"><CommunityBubbles /></div>
        <div className="relative z-10 mx-auto max-w-md space-y-12 text-center">
          <div>
            <div className="mb-4 flex justify-center text-primary"><Briefcase className="h-8 w-8" /></div>
            <h2 className="text-2xl font-bold tracking-tight">Вы производитель?</h2>
            <p className="mx-auto mt-2 text-muted-foreground">Присоединяйтесь к Ciderly, чтобы управлять своим профилем и получать ценную аналитику.</p>
            <div className="mt-6"><Button asChild><Link href="/for-business">Узнать больше</Link></Button></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default function LandingPage() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // Паттерн для избежания ошибки гидратации
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Рендерим заглушку или null на сервере и при первой отрисовке на клиенте
    return null; 
  }

  return isMobile ? <MobileHero /> : <DesktopHero />;
}