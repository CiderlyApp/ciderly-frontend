// FILE: src/components/page-header.tsx
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}