import * as React from 'react';

interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

let toggleId = 0;

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({
    className,
    checked = false,
    onCheckedChange,
    label,
    ariaLabel,
    disabled,
    ...props
  }, ref) => {
    const id = React.useRef(`toggle-${toggleId++}`).current;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };
    return (
      <div
        className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={ariaLabel ?? label}
          className="w-5 h-5 rounded border border-text-secondary/30 bg-panel text-blue focus:ring-blue"
          {...props}
        />
        {label && <label htmlFor={id} className="text-sm text-text-secondary">
          {label}
        </label>}
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';
