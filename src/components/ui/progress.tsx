// path: src/components/ui/progress.tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

// Добавляем пропс для насечек
type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicatorStyle?: React.CSSProperties
  ticks?: number[]
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorStyle, ticks, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {ticks && (
      <div className="absolute inset-0 flex items-center">
        {ticks.map((tickValue) => (
          <div
            key={tickValue}
            className="h-full w-0.5 bg-background/50"
            style={{
              position: 'absolute',
              left: `${tickValue}%`,
            }}
          />
        ))}
      </div>
    )}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all duration-1000 ease-in-out"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        ...indicatorStyle,
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }