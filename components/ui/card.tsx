import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-white/5 text-white shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
