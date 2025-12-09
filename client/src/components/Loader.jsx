import React from 'react'
import '../styles/Loader.css'

const Loader = () => {                   //Loader is used for when i fetching data it takes time If I dont have the loader it will give an error.
  return (
    <div className='loader'>
        <div className='loader-inner'>

        </div>
    </div>
  )
}

export default Loader