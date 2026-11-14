import * as React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  padding?: 'none' | 'sm' | 'default' | 'lg';
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, title, padding = 'default', children, ...props }, ref) => {
    const padClasses: Record<string, string> = {
      none: 'p-0',
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-6',
    };
    return (
      <div
        ref={ref}
        className={[
          'bg-panel border border-text-secondary/10 rounded-lg shadow-sm',
          padClasses[padding],
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {title && (
          <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  },
);

Panel.displayName = 'Panel';
