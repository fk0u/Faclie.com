import * as React from 'react';
import { cn } from '@/utils/tailwind';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 - 100
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-primary transition-all duration-500 ease-out", indicatorClassName)}
          style={{ transform: `translateX(-${100 - Math.max(0, Math.min(100, value || 0)) || 0}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';
export default Progress;
