import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Variant styles
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    };

    // Size styles
    const sizeClasses = {
      xs: 'text-xs px-2.5 py-1.5',
      sm: 'text-sm px-3 py-2',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses} 
          ${variantClasses[variant]} 
          ${sizeClasses[size]} 
          ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

ModernButton.displayName = 'ModernButton';

export default ModernButton;