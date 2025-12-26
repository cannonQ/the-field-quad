import React from 'react';

interface QuadFrameProps {
  children: React.ReactNode;
  compact?: boolean;
}

export function QuadFrame({ children, compact = false }: QuadFrameProps) {
  return (
    <div className={`relative ${compact ? 'pt-8 pb-2 px-1' : 'pt-10 pb-4 px-2'} w-full`}>
      {/* Decorative "Luggage Tag" Handle */}
      <div className={`absolute ${compact ? 'top-1 left-1/2' : 'top-2 left-1/2'} -translate-x-1/2 ${compact ? 'w-28' : 'w-40'} ${compact ? 'h-7' : 'h-10'} z-0`}>
        {/* The Handle Bar */}
        <div className="w-full h-full border-t-4 border-l-4 border-r-4 border-gray-700 rounded-t-3xl opacity-80" />
      </div>

      {/* Connection Circles */}
      <div className={`absolute ${compact ? 'top-6' : 'top-8'} left-1/2 -translate-x-1/2 w-full flex justify-between ${compact ? 'px-8' : 'px-12'} z-20 pointer-events-none`}>
        {/* Blue connection (Top Left side) */}
        <div className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} bg-[#0a0a0a] rounded-full border-[3px] border-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)] transform -translate-y-1/2 ${compact ? 'translate-x-2' : 'translate-x-4'}`} />

        {/* Yellow connection (Top Right side) */}
        <div className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} bg-[#0a0a0a] rounded-full border-[3px] border-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)] transform -translate-y-1/2 ${compact ? '-translate-x-2' : '-translate-x-4'}`} />
      </div>

      {/* Main Gradient Border Container */}
      <div
        className="relative z-10 rounded-[2.5rem] p-[4px] shadow-2xl overflow-hidden"
        style={{
          background: `conic-gradient(from 315deg at 50% 50%,
            #3B82F6 0deg,
            #F59E0B 90deg,
            #10B981 180deg,
            #EF4444 270deg,
            #3B82F6 360deg)`,
        }}
      >
        {/* Inner Content Container */}
        <div className="bg-[#0f1115] rounded-[2.3rem] p-4 h-full relative overflow-hidden">
          {/* Subtle Texture/Noise */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          <div className="relative z-10">{children}</div>

          <div className="mt-4 mb-1 text-center">
            <p className={`${compact ? 'text-[8px]' : 'text-[10px]'} text-gray-500 font-mono tracking-wider`}>
              *The Field includes: UNC, Arizona, Tennessee + 60 others
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
