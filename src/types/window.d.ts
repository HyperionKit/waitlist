// Type definitions for window.ethereum (MetaMask/Web3)

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, callback: (accounts: string[]) => void): void;
  removeListener(event: string, callback: (accounts: string[]) => void): void;
}

interface Window {
  ethereum?: EthereumProvider;
}

