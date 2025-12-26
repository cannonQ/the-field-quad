'use client';

import { useState } from 'react';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);

  const connect = async () => {
    console.log('DUMMY: Connect wallet clicked');
    setConnected(true);
    setAddress('9fRAWhdx...abc123');
    setCredits(12.50);
  };

  const disconnect = () => {
    console.log('DUMMY: Disconnect wallet');
    setConnected(false);
    setAddress(null);
    setCredits(0);
  };

  return { connected, address, credits, connect, disconnect };
}
