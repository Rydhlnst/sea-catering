import FinalCTASection from '@/components/HomePage/FinalCTASection'
import MenuHeroSection from '@/components/HomePage/MenuHeroSection'
import React from 'react'

const MenuPage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <MenuHeroSection />
      <FinalCTASection/>
    </div>
  )
}

export default MenuPage