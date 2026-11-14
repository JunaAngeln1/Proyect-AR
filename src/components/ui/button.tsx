import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

const base =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<string, string> = {
  default: 'bg-blue text-text hover:bg-blue/90 focus:ring-blue',
  destructive:
    'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  outline:
    'border border-text-secondary/30 bg-transparent hover:bg-text-secondary/10 focus:ring-blue',
  secondary:
    'bg-panel text-text hover:bg-panel/80 focus:ring-purple',
  ghost: 'bg-transparent hover:bg-text-secondary/10 focus:ring-blue',
  link: 'text-blue underline-offset-4 hover:underline focus:ring-blue',
};

const sizes: Record<string, string> = {
  sm: 'h-8 px-3 text-sm',
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-8 text-base',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={[
        base,
        variants[variant],
        sizes[size],
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
