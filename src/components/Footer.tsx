'use client';
import React from 'react';

function Footer() {
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='text-center text-gray-500 text-md mt-2'>
        © {new Date().getFullYear()} SPV. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
