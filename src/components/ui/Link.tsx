import { AnchorHTMLAttributes } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'nav' | 'footer' | 'inline';
  children: React.ReactNode;
}

export default function Link({
  variant = 'nav',
  children,
  className = '',
  ...props
}: LinkProps) {
  const variants = {
    nav: 'font-sans text-sm font-medium text-revista-text hover:text-revista-gold transition-colors',
    footer: 'font-sans text-sm text-revista-text hover:text-revista-gold transition-colors',
    inline: 'font-headline text-revista-text hover:text-revista-gold underline-offset-4 hover:underline transition-all',
  };

  return (
    <a
      className={`${variants[variant]} ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </a>
  );
}
