'use client'

import React, { useState, useEffect } from 'react';

const WaitlistPage = () => {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const [availableWallets, setAvailableWallets] = useState([]);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    detectWallets();
    checkIfWalletIsConnected();
    loadUserData();
  }, []);

  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const savedAccount = localStorage.getItem('waitlist_account');
      const savedPosition = localStorage.getItem('waitlist_position');
      
      if (savedAccount) {
        setAccount(savedAccount);
        setJoined(true);
        setPosition(parseInt(savedPosition) || generatePosition());
      }
    }
  };

  const generatePosition = () => {
    return Math.floor(Math.random() * 5000) + 8000;
  };

  const detectWallets = () => {
    const wallets = [];
    
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.isMetaMask) {
        wallets.push({ name: 'MetaMask', provider: window.ethereum });
      }
      if (window.ethereum.isCoinbaseWallet) {
        wallets.push({ name: 'Coinbase Wallet', provider: window.ethereum });
      }
      if (window.ethereum.isTrust) {
        wallets.push({ name: 'Trust Wallet', provider: window.ethereum });
      }
      if (window.ethereum.isRabby) {
        wallets.push({ name: 'Rabby', provider: window.ethereum });
      }
      if (window.ethereum.isBraveWallet) {
        wallets.push({ name: 'Brave Wallet', provider: window.ethereum });
      }
      
      if (wallets.length === 0) {
        wallets.push({ name: 'Wallet', provider: window.ethereum });
      }
    }

    if (window.ethereum?.providers && window.ethereum.providers.length > 0) {
      const detectedWallets = [];
      window.ethereum.providers.forEach(provider => {
        if (provider.isMetaMask && !detectedWallets.some(w => w.name === 'MetaMask')) {
          detectedWallets.push({ name: 'MetaMask', provider });
        }
        if (provider.isCoinbaseWallet && !detectedWallets.some(w => w.name === 'Coinbase Wallet')) {
          detectedWallets.push({ name: 'Coinbase Wallet', provider });
        }
        if (provider.isTrust && !detectedWallets.some(w => w.name === 'Trust Wallet')) {
          detectedWallets.push({ name: 'Trust Wallet', provider });
        }
        if (provider.isRabby && !detectedWallets.some(w => w.name === 'Rabby')) {
          detectedWallets.push({ name: 'Rabby', provider });
        }
        if (provider.isBraveWallet && !detectedWallets.some(w => w.name === 'Brave Wallet')) {
          detectedWallets.push({ name: 'Brave Wallet', provider });
        }
      });
      
      if (detectedWallets.length > 0) {
        setAvailableWallets(detectedWallets);
        return;
      }
    }

    setAvailableWallets(wallets);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = window.ethereum.providers?.[0] || window.ethereum;
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && !localStorage.getItem('waitlist_account')) {
          setAccount(accounts[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async (walletProvider) => {
    setIsConnecting(true);
    setError('');
    
    try {
      let accounts;
      
      if (walletProvider.request) {
        accounts = await walletProvider.request({ 
          method: 'eth_requestAccounts' 
        });
      } else {
        accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
      }
      
      setAccount(accounts[0]);
    } catch (err) {
      setError('Connection failed');
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const joinWaitlist = () => {
    const newPosition = generatePosition();
    
    setPosition(newPosition);
    setJoined(true);
    
    localStorage.setItem('waitlist_account', account);
    localStorage.setItem('waitlist_position', newPosition.toString());
  };

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="min-h-screen w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">

      <div className="flex items-center justify-center min-h-screen p-4">
        
        <div className="w-full max-w-md">
          
          {!joined ? (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  Join Waitlist
                </h1>
                <p className="text-gray-400 text-lg">
                  Connect your wallet to get early access
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {!account ? (
                <div className="space-y-3">
                  {availableWallets.length > 0 ? (
                    availableWallets.map((wallet, index) => (
                      <button
                        key={index}
                        onClick={() => connectWallet(wallet.provider)}
                        disabled={isConnecting}
                        className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3.5 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                      >
                        <span>{isConnecting ? 'Connecting...' : wallet.name}</span>
                        <span className="text-gray-400">→</span>
                      </button>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded p-6 text-center">
                      <p className="text-white mb-2">No wallet found</p>
                      <p className="text-gray-500 text-sm mb-4">Install MetaMask or another Web3 wallet</p>
                      <a 
                        href="https://metamask.io/download/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-white hover:bg-gray-100 text-black font-medium py-2.5 px-5 rounded transition-colors text-sm"
                      >
                        Get MetaMask
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Wallet</p>
                    <p className="text-white font-mono">{formatAddress(account)}</p>
                  </div>
                  <button
                    onClick={joinWaitlist}
                    className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3.5 px-6 rounded transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                <span>Launching Q1 2026</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  Welcome aboard
                </h1>
                <p className="text-gray-400 text-lg">
                  You're officially on the list. We'll notify you at your wallet address when we launch.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Connected Wallet</p>
                    <p className="text-white font-mono text-lg font-semibold">{formatAddress(account)}</p>
                  </div>
                </div>
                <div className="pl-15">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Keep an eye on this address. That's where you'll receive your launch notification and early access details.
                  </p>
                </div>
              </div>

              <div className="bg-purple-600/5 border border-purple-500/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-purple-300 text-sm">
                  <span className="font-semibold">What's next?</span> We're putting the finishing touches on the platform. Expect to hear from us in Q1 2026.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;