'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Sales from './Sales';

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

const logos = Array(30).fill(null).flatMap(() => baseLogos);

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Dashboard() {
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
    <motion.section
      className="flex flex-col gap-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo Marquee Section */}
      <motion.div className="w-full py-8" variants={fadeInUp}>
        <div className="overflow-hidden mx-auto h-[40px] md:h-[60px] relative">
          <motion.div
            className="flex absolute gap-20 items-center"
            animate={controls}
            style={{ width: 'max-content' }}
          >
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={logo}
                  alt={`Partner Logo ${index + 1}`}
                  className="h-6 md:h-12 w-auto object-contain opacity-100 hover:opacity-95 hover:scale-95 transition duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Sales Summary and Chart Section */}
      <motion.div className="w-full" variants={fadeInUp}>
        <Sales />
      </motion.div>
    </motion.section>
  );
}
