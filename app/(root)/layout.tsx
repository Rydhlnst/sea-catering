import Footer from '@/components/HomePage/Footer'
import Navbar from '@/components/HomePage/Navbar'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const LandingPageLayout = ({children}: Props) => {
  return (
        <div className="h-full w-full flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </div>
  )
}

export default LandingPageLayout