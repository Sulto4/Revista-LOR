import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-metadata font-medium mb-2 text-revista-text">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border border-revista-separator bg-revista-white text-revista-text font-sans text-base focus:outline-none focus:border-revista-gold transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
