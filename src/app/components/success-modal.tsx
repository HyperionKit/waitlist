'use client';

import React, { useEffect } from 'react';
import { X, PartyPopper, Check, Mail, Wallet, Info, ArrowDown } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  walletAddress?: string;
  onViewSteps?: () => void;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  email = 'user@example.com',
  walletAddress = '0x71C...9A21',
  onViewSteps 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewSteps = () => {
    onClose();
    if (onViewSteps) {
      setTimeout(() => {
        onViewSteps();
      }, 300);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-[#131317] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden group">
        {/* Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
        
        <div className="p-6 md:p-8 text-center relative z-10">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Row */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-b from-purple-500/20 to-purple-500/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] relative">
            <PartyPopper className="w-8 h-8 text-purple-400 absolute opacity-20 animate-pulse" />
            <Check className="w-8 h-8 text-purple-300 relative z-10" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Spot secured!</h3>
          <p className="text-slate-400 text-sm mb-6">Check your email to confirm your spot.</p>

          {/* User Details */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Email</div>
                <div className="text-sm text-slate-200 truncate font-medium">{email}</div>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Wallet</div>
                <div className="text-sm text-slate-200 truncate font-medium font-mono text-xs">{walletAddress}</div>
              </div>
              <div className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">
                Connected
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-start gap-2 text-xs text-left text-slate-500 mb-6 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p>You'll get updates about beta waves, rewards, and your queue position here.</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-white text-black rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-purple-900/20"
            >
              Got it
            </button>
            <button 
              onClick={handleViewSteps}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors font-medium flex items-center justify-center gap-1 group/btn"
            >
              <span>View next steps</span>
              <ArrowDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

