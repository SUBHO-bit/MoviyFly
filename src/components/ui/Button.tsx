import * as React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ButtonVariant, ButtonSize } from '../../types';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans focus-ring-custom cursor-pointer transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white font-semibold shadow-purple-glow hover:bg-primary-hover active:scale-[0.98]',
      secondary: 'bg-secondary text-text-primary hover:bg-[#32323D] active:bg-[#1E1E26] active:scale-[0.98]',
      ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 active:bg-white/10 active:scale-[0.98]',
      outline: 'bg-transparent border border-white/10 text-text-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10 active:scale-[0.98]',
      destructive: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 active:scale-[0.98]',
      icon: 'p-2.5 aspect-square rounded-full bg-secondary border border-white/5 text-text-secondary hover:text-white hover:bg-[#32323D] hover:border-white/10 active:scale-[0.95]'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-caption rounded-sm gap-1.5',
      md: 'px-5 py-2.5 text-small rounded-md gap-2',
      lg: 'px-7 py-3 text-body rounded-lg gap-2.5'
    };

    const motionProps = {
      whileHover: disabled || isLoading ? {} : { y: -1 },
      whileTap: disabled || isLoading ? {} : { scale: 0.98 },
    };

    return (
      <motion.button
        ref={ref as any}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'icon' && sizes[size],
          isLoading && 'relative text-transparent!',
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {!isLoading && leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
        {!isLoading && children}
        {!isLoading && rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
