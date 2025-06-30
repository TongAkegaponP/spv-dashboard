'use client';

import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';

const baseLogos = [
  '/hikrobot-logo.png',
  '/mvtec-logo.png',
  '/halcon-logo.png',
  '/merlic-logo.png',
  '/navitar-logo.png',
  '/jaka-logo.png',
  '/mech mind-logo.png',
  '/heliotis-logo.png',
  '/moritex-logo.png',
];

// Repeat the first 3 logos to simulate infinite pattern
const logos = Array(30).fill(null).flatMap(() => baseLogos);

function Dashboard() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ['0%', '-100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1000,
          ease: 'linear',
        },
      },
    });
  }, [controls]);

  return (
    <section className=" py-5 px-4 h-[80px] items-center">
      <div className="overflow-hidden mx-auto">
        <div className="relative w-full h-[140px]">
          <motion.div
            className="flex absolute gap-20"
            animate={controls}
            style={{ width: 'max-content' }}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center space-y-2"
              >
                <img
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  className="h-6 md:h-12 w-auto object-contain opacity-100 hover:opacity-80 transition duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
