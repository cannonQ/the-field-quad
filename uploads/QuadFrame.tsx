import React from 'react';

interface QuadFrameProps {
  children: React.ReactNode;
}

export const QuadFrame: React.FC<QuadFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="absolute -top-4 left-8 w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-600" />
      <div className="absolute -top-4 right-8 w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-600" />

      <div className="relative rounded-3xl border-4 border-gray-700 p-4 bg-black/40">
        {children}
      </div>
    </div>
  );
};
