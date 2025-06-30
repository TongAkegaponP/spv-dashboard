'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    // Optionally clear session or cookie here
  };

  const NavButton = () => (
    isLoggedIn ? (
      <button
        className="bg-red-600 py-2 px-4 rounded-md text-white text-2xl font-semibold hover:scale-110 transition"
        onClick={() => setShowLogoutConfirm(true)}
      >
        LOG OUT
      </button>
    ) : (
      <button
        className="bg-green-600 py-2 px-4 rounded-md text-white text-2xl font-semibold hover:scale-110 transition"
        onClick={() => setShowLogin(true)}
      >
        LOGIN
      </button>
    )
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto max-w-[1920px] p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-4">
            <a href="/">
              <img
                src="/spv-logo-2.png"
                alt="Logo"
                className="h-10 md:h-15 duration-200 hover:scale-110 hover:brightness-90"
              />
            </a>
            <h1 className="hidden md:block text-gray-700 font-bold text-xl sm:text-5xl">
              SP Vision Technology
            </h1>
          </div>
          <button
            className="md:hidden text-3xl text-gray-800 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-end mt-4 md:mt-0">
          <ul className="flex items-center gap-10">
            {[
              { name: 'DASHBOARD', href: '/' },
              { name: 'DATABASE', href: '/database' },
              { name: 'ASSET', href: '/' },
              { name: 'TICKET', href: '/' },
            ].map((item) => (
              <li key={item.name} className="text-gray-800 text-2xl font-semibold hover:scale-110 transition">
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
            <NavButton />
          </ul>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="flex flex-col items-start text-left mt-4 space-y-3 md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {['DASHBOARD', 'DATABASE', 'ASSET', 'TICKET'].map((item) => (
                <li key={item} className="text-gray-800 text-xl font-semibold hover:scale-110 transition">
                  <a href="#">{item}</a>
                </li>
              ))}
              <NavButton />
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Modals */}
        <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />

        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-opacity duration-300 ease-in-out animate-modalFadeIn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded shadow-md w-80 text-center">
              <p className="mb-4 text-lg font-semibold">Are you sure you want to log out?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}