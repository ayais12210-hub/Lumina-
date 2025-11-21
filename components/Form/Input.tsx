
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full group">
        <div className="relative z-0 w-full mb-1">
          <input
            ref={ref}
            placeholder=" "
            className={`block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-200 ${
              error 
                ? 'border-red-500 focus:border-red-600' 
                : 'border-slate-200 focus:border-blue-600'
            } ${className}`}
            {...props}
          />
          <label 
            className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
              error ? 'text-red-500' : 'text-slate-500 peer-focus:text-blue-600'
            }`}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
