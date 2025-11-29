"use client";
import React from 'react'
import PerksPage from './components/perks-page';
import HeroPage from './components/hero-page';

const page = () => {
  return (
    <div className='bg-black'>
      <HeroPage />
      <PerksPage />
    </div>
  )
}

export default page