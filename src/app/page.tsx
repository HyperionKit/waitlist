"use client";
import React from 'react'
import PerksPage from './components/perks-page';
import HeroPage from './components/hero-page';
import ValueProposition from './components/value-proposition';

const page = () => {
  return (
    <div className='bg-black'>
      <HeroPage />
      <ValueProposition />
      <PerksPage />
    </div>
  )
}

export default page