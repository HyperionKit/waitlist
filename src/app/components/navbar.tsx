'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedLogo, OptimizedIcon } from './ui/optimized-image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Close explore dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black w-full">
      <div className="container max-w-7xl mx-auto flex items-center justify-between py-3">
        {/* Logo - Hyperkit Header White */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <OptimizedLogo 
              src="/logo/brand/hyperkit/Hyperkit Header White.svg" 
              alt="Hyperkit" 
              width={120}
              height={48}
              className="h-12 sm:h-14 lg:h-16 w-auto"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center flex-1 justify-center gap-6 xl:gap-12">
          <Link href="/foundation" className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-medium text-sm xl:text-base" style={{fontFamily: 'Be Vietnam Pro'}}>
            <OptimizedIcon src="/icons/navbar/foundation.svg" alt="Foundation" width={16} height={16} />
            <span className="hidden xl:inline">Foundation</span>
          </Link>
          <Link href="/products" className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-medium text-sm xl:text-base" style={{fontFamily: 'Be Vietnam Pro'}}>
            <OptimizedIcon src="/icons/navbar/products.png" alt="Products" width={16} height={16} />
            <span className="hidden xl:inline">Products</span>
          </Link>
          {/* Explore Dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
              className="flex items-center gap-2 text-white hover:text-cyan-300 transition-all duration-300 font-medium text-sm xl:text-base group"
              style={{fontFamily: 'Be Vietnam Pro'}}
            >
              <OptimizedIcon 
                src="/icons/navbar/explore.png" 
                alt="Explore" 
                width={16} 
                height={16}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
            <span className="hidden xl:inline">Explore</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div 
              className={`absolute top-full left-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 transform ${
                isExploreOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <div className="py-2">
                <Link 
                  href="/ecosystem" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{fontFamily: 'Inter'}}>Ecosystem</div>
                    <div className="text-xs text-gray-400">Discover our partners</div>
                  </div>
                </Link>

                <Link 
                  href="/community" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{fontFamily: 'Inter'}}>Community</div>
                    <div className="text-xs text-gray-400">Join the conversation</div>
                  </div>
                </Link>

                <Link 
                  href="/showcase" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{fontFamily: 'Inter'}}>Showcase</div>
                    <div className="text-xs text-gray-400">See what's built</div>
                  </div>
                </Link>

                <Link 
                  href="/tutorials" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{fontFamily: 'Inter'}}>Tutorials</div>
                    <div className="text-xs text-gray-400">Learn & build</div>
                  </div>
                </Link>

                <div className="border-t border-gray-700 my-2"></div>

                <Link 
                  href="/api-docs" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{fontFamily: 'Inter'}}>API Reference</div>
                    <div className="text-xs text-gray-400">Developer resources</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Link href="/roadmap" className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-medium text-sm xl:text-base" style={{fontFamily: 'Be Vietnam Pro'}}>
            <OptimizedIcon src="/icons/navbar/roadmap.png" alt="Roadmap" width={16} height={16} />
            <span className="hidden xl:inline">Roadmap</span>
          </Link>
          <Link href="/build" className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-medium text-sm xl:text-base" style={{fontFamily: 'Be Vietnam Pro'}}>
            <OptimizedIcon src="/icons/navbar/build.svg" alt="Build" width={16} height={16} />
            <span className="hidden xl:inline">Build</span>
          </Link>
          <a href="https://docs.hyperionkit.xyz/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-medium text-sm xl:text-base" style={{fontFamily: 'Be Vietnam Pro'}}>
            <OptimizedIcon src="/icons/navbar/docs.svg" alt="Docs" width={16} height={16} />
            <span className="hidden xl:inline">Docs</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:text-cyan-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <div className="px-4 py-6 space-y-4">
            <Link href="/foundation" className="flex items-center gap-3 text-white hover:text-cyan-300 transition-colors font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
              <OptimizedIcon src="/icons/navbar/foundation.svg" alt="Foundation" width={20} height={20} />
              Foundation
            </Link>
            <Link href="/products" className="flex items-center gap-3 text-white hover:text-cyan-300 transition-colors font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
              <OptimizedIcon src="/icons/navbar/products.png" alt="Products" width={20} height={20} />
              Products
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-white font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
                <OptimizedIcon src="/icons/navbar/explore.png" alt="Explore" width={20} height={20} />
              Explore
              </div>
              <div className="ml-8 space-y-2">
                <Link href="/ecosystem" className="block text-gray-300 hover:text-cyan-300 transition-colors text-sm py-1" style={{fontFamily: 'Inter'}}>
                  Ecosystem
                </Link>
                <Link href="/community" className="block text-gray-300 hover:text-cyan-300 transition-colors text-sm py-1" style={{fontFamily: 'Inter'}}>
                  Community
                </Link>
                <Link href="/showcase" className="block text-gray-300 hover:text-cyan-300 transition-colors text-sm py-1" style={{fontFamily: 'Inter'}}>
                  Showcase
                </Link>
                <Link href="/tutorials" className="block text-gray-300 hover:text-cyan-300 transition-colors text-sm py-1" style={{fontFamily: 'Inter'}}>
                  Tutorials
                </Link>
                <Link href="/api-docs" className="block text-gray-300 hover:text-cyan-300 transition-colors text-sm py-1" style={{fontFamily: 'Inter'}}>
                  API Reference
                </Link>
              </div>
            </div>
            <Link href="/roadmap" className="flex items-center gap-3 text-white hover:text-cyan-300 transition-colors font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
              <OptimizedIcon src="/icons/navbar/roadmap.png" alt="Roadmap" width={20} height={20} />
              Roadmap
            </Link>
            <Link href="/build" className="flex items-center gap-3 text-white hover:text-cyan-300 transition-colors font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
              <OptimizedIcon src="/icons/navbar/build.svg" alt="Build" width={20} height={20} />
              Build
            </Link>
            <a href="https://docs.hyperionkit.xyz/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-cyan-300 transition-colors font-medium py-2" style={{fontFamily: 'Be Vietnam Pro'}}>
              <OptimizedIcon src="/icons/navbar/docs.svg" alt="Docs" width={20} height={20} />
              Docs
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}