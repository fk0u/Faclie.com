import * as React from 'react';
import { cn } from '@/utils/tailwind';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98 transition-transform duration-100",
          {
            "bg-primary text-primary-foreground shadow hover:opacity-95": variant === 'default',
            "bg-destructive text-destructive-foreground shadow hover:opacity-95": variant === 'destructive',
            "border border-border bg-transparent shadow-sm hover:bg-secondary hover:text-secondary-foreground": variant === 'outline',
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-opacity-90": variant === 'secondary',
            "hover:bg-accent hover:text-accent-foreground": variant === 'ghost',
            "text-primary underline-offset-4 hover:underline": variant === 'link',
            "glass text-foreground hover:bg-white/30 dark:hover:bg-black/30": variant === 'glass',
          },
          {
            "h-9 px-4 py-2": size === 'default',
            "h-8 rounded-md px-3 text-xs": size === 'sm',
            "h-10 rounded-md px-8": size === 'lg',
            "h-9.5 w-9.5": size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export default Button;
