import { useSelector, useDispatch } from 'react-redux';
import { SelectorAppState } from '../interfaces/AppStateInterface';
import {
  setUserAddress,
  setWalletState,
  setWalletSelectOpen
} from '../redux/appSlice';
import { setupWallet } from '../ergofunctions/walletUtils';

export function useWallet() {
  const dispatch = useDispatch();

  const userAddress = useSelector((state: SelectorAppState) => state.app.userAddress);
  const walletState = useSelector((state: SelectorAppState) => state.app.walletState);
  const userTokens = useSelector((state: SelectorAppState) => state.app.userTokens);

  const connected = walletState !== 'Configure' && userAddress !== null;

  // Format address for display (truncated)
  const address = userAddress
    ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}`
    : null;

  // Credits system - could be derived from user tokens or stored separately
  const credits = 0; // Placeholder - implement based on your token system

  const connect = async (walletType: 'nautilus' | 'safew' | 'ergopay' = 'nautilus') => {
    // Open wallet selection modal
    dispatch(setWalletSelectOpen(true));
  };

  const disconnect = () => {
    dispatch(setUserAddress(null));
    dispatch(setWalletState('Configure'));
    localStorage.removeItem('wallet');
  };

  return {
    connected,
    address,
    fullAddress: userAddress,
    credits,
    walletState,
    userTokens,
    connect,
    disconnect
  };
}
