'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Web3Hero() {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    if (isMounted) {
      checkIfWalletIsConnected();
    }
  }, [isMounted]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const handleConnectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const ethereum = window.ethereum;
      
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check if we're on an EVM-compatible network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      
      // Listen for account changes
      ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setIsWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
        }
      });

      // Listen for chain changes
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSecureSpot = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    
    // Here you would typically make an API call to your backend
    // For now, we'll just show a success message
    alert(`🎉 Spot secured!\n\nEmail: ${email}\nWallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}\n\nYou'll receive early access details soon!`);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        {/* Logo with glow effect */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600 blur-3xl opacity-50 rounded-full"></div>
            <div className="relative bg-black border border-purple-500/30 rounded-3xl p-1 w-24 h-24 flex items-center justify-center">
              <Image
                src="/logo/brand/hyperkit/Hyperkit-logo.png"
                alt="Hyperkit Logo"
                width={56}
                height={56}
                className="w-15 h-15 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          Build the future of
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
          Web3 AI.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience Hyperkit Studio before anyone else. Join the waitlist for
          early access to the next generation of on-chain builder tools.
        </p>

        {/* Error message */}
        {error && (
          <div className="max-w-xl mx-auto mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Email input and buttons */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-2xl blur-lg"></div>
            <div className="relative shadow-lg rounded-2xl p-1 bg-black border border-purple-500/30 p-1">
              <div className="bg-black rounded-2xl p-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@hyperkit.xyz"
                  className="bg-transparent text-gray-300 placeholder-gray-600 flex-1 outline-none text-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting || isWalletConnected}
              className={`flex-1 ${
                isWalletConnected
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-white/5 border-gray-700 text-gray-300 hover:border-gray-600'
              } border px-6 py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isConnecting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </>
              ) : isWalletConnected ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {formatAddress(walletAddress)}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
            <button
              onClick={handleSecureSpot}
              className="flex-1 bg-white text-black px-6 py-4 rounded-xl font-semibold text-base hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Secure your spot
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Beta badge */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-500">Limited spots available for Beta Wave 1</span>
        </div>
      </div>
    </div>
  );
}