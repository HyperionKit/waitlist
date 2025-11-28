"use client";
import React, { useState } from 'react';
import { Search, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Large 404 Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[clamp(200px,40vw,600px)] font-bold text-[#A37EF1]/10 leading-none select-none">
          404
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6">
          We lost this page
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-300 mb-12">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleGoBack}
            className="px-6 py-3.5 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3.5 bg-[#7C3AED] text-white font-medium rounded-lg hover:bg-[#6a31cd] transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}