import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-8 py-3 font-sans text-base font-medium transition-all duration-300';

  const variants = {
    primary: 'bg-revista-white border border-revista-black text-revista-black hover:border-revista-gold hover:text-revista-gold',
    secondary: 'bg-revista-black border border-revista-black text-revista-white hover:bg-revista-gold hover:border-revista-gold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
