import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 font-medium rounded-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 border border-transparent",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
    outline: "bg-transparent text-slate-900 border border-slate-200 hover:border-slate-900",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
  };

  const sizes = {
    sm: "h-8 px-4 text-xs tracking-wide uppercase",
    md: "h-12 px-6 text-sm tracking-wide",
    lg: "h-14 px-8 text-base tracking-wide",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};