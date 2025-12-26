import { useState } from 'react';

export function useWallet() {
  // DUMMY - will be replaced with existing wallet logic
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);

  const connect = async () => {
    console.log('DUMMY: Connect wallet clicked');
    // Simulate connection
    setConnected(true);
    setAddress('9fRAWhdx...abc123');
    setCredits(12.50); // Dummy credits
  };

  const disconnect = () => {
    console.log('DUMMY: Disconnect wallet');
    setConnected(false);
    setAddress(null);
    setCredits(0);
  };

  return { connected, address, credits, connect, disconnect };
}
