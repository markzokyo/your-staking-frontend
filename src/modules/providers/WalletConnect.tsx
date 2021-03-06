import React, { FC, ReactNode, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { isMobile } from 'react-device-detect';
import { WalletModalContext } from '@modules/context/WalletContex';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

interface ModalProviderProps {
  children?: ReactNode;
}

export const WalletConnect: FC<ModalProviderProps> = ({ children }) => {
  const [isConnectWalletModal, setIsConnectWalletModal] = useState<boolean>(false);
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const walletsDesktop = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new SlopeWalletAdapter(),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network],
  );

  const walletsMobile = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={isMobile ? walletsMobile : walletsDesktop} autoConnect>
        <WalletModalProvider>
          <WalletModalContext.Provider value={{ isConnectWalletModal, setIsConnectWalletModal }}>
            {children}
          </WalletModalContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
