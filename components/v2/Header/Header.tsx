import React from 'react';
import { ShieldIcon } from '../Icons/ShieldIcon';
import { useWallet } from '../../../hooks/useWallet';

export const Header: React.FC = () => {
  const { connected, address, connect, disconnect } = useWallet();

  const handleConnectClick = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ShieldIcon className="text-white" size={32} />
            <h1 className="text-xl font-bold text-white">The Field</h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/40 text-sm font-medium hover:bg-orange-600/30 transition-colors"
              onClick={() => console.log('NCAA filter clicked')}
            >
              🏀 NCAA
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gray-800/50 text-gray-400 border border-gray-700 text-sm font-medium hover:bg-gray-800 transition-colors"
              onClick={() => console.log('NFL filter clicked')}
            >
              🏈 NFL
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gray-800/50 text-gray-400 border border-gray-700 text-sm font-medium hover:bg-gray-800 transition-colors"
              onClick={() => console.log('POLITICS filter clicked')}
            >
              🛡️ POLITICS
            </button>
          </div>

          <button
            onClick={handleConnectClick}
            className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            {connected ? address : 'Connect'}
          </button>
        </div>
      </div>
    </header>
  );
};
