import React from 'react'
import  Navbar  from "../components/Navbar"
import Categories from '../components/Categories'
import Slide from '../components/Slide'
import Listings from '../components/Listings'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <>
    <Navbar />
    <Slide />
    <Categories />
    <Listings />
    <Footer/>
    </>
  )
}

export default HomePage