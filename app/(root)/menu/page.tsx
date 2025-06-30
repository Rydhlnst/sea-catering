import MenuHeadSection from '@/components/HomePage/MenuHeroSection'
import React from 'react'

// Ini bisa menjadi Server Component karena tidak ada interaktivitas langsung
const MenuPage = () => {
  return (
    <div className='min-h-screen'>
      <MenuHeadSection />
    </div>
  )
}

export default MenuPage