import React from 'react';
import { Button } from '../../ui/button';
import { FieldLogo } from '../Icons/ShieldIcon';
import { useWallet } from '../../../hooks/useWallet';

export function Header() {
  const { connected, address, connect, disconnect } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <FieldLogo />
      </div>

      <div className="hidden md:flex items-center gap-2">
        {['NCAA', 'NFL', 'POLITICS'].map((cat) => (
          <div
            key={cat}
            className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-400 hover:bg-white/10 cursor-pointer transition-colors flex items-center gap-2"
          >
            {cat === 'NCAA' && <span className="text-orange-500">🏀</span>}
            {cat === 'NFL' && <span className="text-blue-500">🏈</span>}
            {cat === 'POLITICS' && <span className="text-gray-400">⚖️</span>}
            {cat}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={() => connected ? disconnect() : connect()}
          className="bg-transparent border-white/20 text-white hover:bg-white/10 text-xs font-mono"
        >
          {connected ? (address ? `${address.slice(0, 4)}...${address.slice(-2)}` : 'Connected') : 'Connect'}
        </Button>
      </div>
    </header>
  );
}
