import React from 'react';

// Use public folder path for static export
const shieldWhitePath = '/assets/images/field_shield_white.png';

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FieldLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <img src={shieldWhitePath} alt="The Field" className="h-8 w-8 object-contain" />
      <span className="font-bold text-xl tracking-tight text-white">The Field</span>
    </div>
  );
}

export { shieldWhitePath };
