'use client'
import React, { useEffect } from 'react';

const Warning = () => {
  
  useEffect(() => {
    if (!localStorage.getItem('alertShown')) {
      alert("This website is a showcase of my coding skills and is not a fully operational product!!! The use of this website is at own risk!!");
      localStorage.setItem('alertShown', 'true');
    }
  }, []);

  
  return (
    <div className=''>
    </div>
  )
}

export default Warning