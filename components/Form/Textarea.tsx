
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full group">
        <div className="relative z-0 w-full mb-1">
          <textarea
            ref={ref}
            placeholder=" "
            rows={4}
            className={`block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-200 resize-none ${
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

Textarea.displayName = 'Textarea';
