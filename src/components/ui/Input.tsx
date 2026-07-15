import * as React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- INPUT PROPS ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-caption font-semibold text-text-secondary select-none tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-text-muted pointer-events-none transition-colors duration-200">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full h-11 bg-surface border border-white/5 rounded-md px-4 py-2.5 text-small text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-danger focus:border-danger focus:ring-danger/10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-caption text-danger mt-0.5 leading-none font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-caption text-text-muted mt-0.5 leading-none">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- SEARCH INPUT ---
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = 'Search movies, shows, genres...', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder={placeholder}
        className={cn('bg-card hover:bg-card-elevated focus:bg-surface', className)}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

// --- TEXTAREA ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-caption font-semibold text-text-secondary select-none tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[100px] bg-surface border border-white/5 rounded-md px-4 py-2.5 text-small text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 resize-y',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-caption text-danger mt-0.5 leading-none font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-caption text-text-muted mt-0.5 leading-none">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// --- SELECT ---
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-caption font-semibold text-text-secondary select-none tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-11 bg-surface border border-white/5 rounded-md pl-4 pr-10 py-2.5 text-small text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 appearance-none cursor-pointer',
              error && 'border-danger focus:border-danger focus:ring-danger/10',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-text-primary py-2">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-transform duration-200">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="text-caption text-danger mt-0.5 leading-none font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-caption text-text-muted mt-0.5 leading-none">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
