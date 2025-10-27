// FILE: src/components/store-buttons.tsx
import Image from "next/image";
import Link from "next/link";

export const AppStoreButton = () => (
  <Link href="#" aria-label="Download on the App Store" className="inline-block transition-opacity hover:opacity-80">
    <Image
      src="/images/app-store-badge.svg"
      alt="Download on the App Store"
      width={120}
      height={40}
      // ИСПРАВЛЕНО: h-80 (320px) заменено на h-12 (48px)
      className="h-12 w-auto" 
      priority
    />
  </Link>
);

export const GooglePlayButton = () => (
  <Link href="#" aria-label="Get it on Google Play" className="inline-block transition-opacity hover:opacity-80">
    <Image
      src="/images/google-play-badge.svg"
      alt="Get it on Google Play"
      width={135} 
      height={40}
      // ИСПРАВЛЕНО: h-80 (320px) заменено на h-12 (48px)
      className="h-12 w-auto"
      priority
    />
  </Link>
);