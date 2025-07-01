'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeAvatarModal from './ChangeAvatarModal';
import TextAvatar from './TextAvatar';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{
    name: string;
    avatar?: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginSuccess = () => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
  };

  const NavUserMenu = () =>
    user ? (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition hover:cursor-pointer"
        >
          {user.avatar ? (
            <img
              src={`data:image/png;base64,${user.avatar}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <TextAvatar username={user.username} />
          )}
          <span>|</span>
          <span className="text-gray-800 font-semibold">{user.name}</span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setShowChangeAvatar(true);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                Change Avatar
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 hover:cursor-pointer"
              >
                Log Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ) : (
      <button
        className="bg-green-600 py-2 px-4 rounded-md text-white text-2xl font-semibold hover:scale-110 transition hover:cursor-pointer"
        onClick={() => setShowLogin(true)}
      >
        LOGIN
      </button>
    );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto max-w-[1920px] p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo and Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <a href="/" className="flex items-center space-x-4">
            <img
              src="/spv-logo-2.png"
              alt="Logo"
              className="h-10 md:h-15 duration-200 hover:scale-110 hover:brightness-90"
            />
            <h1 className="hidden md:block text-gray-700 font-bold text-xl sm:text-5xl">
              SP Vision Technology
            </h1>
          </a>
          <button
            className="md:hidden text-3xl text-gray-800 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-end mt-4 md:mt-0 items-center gap-10">
          {[
            { name: 'DASHBOARD', href: '/' },
            { name: 'DATABASE', href: '/database' },
            { name: 'ASSET', href: '/assets' },
            { name: 'TICKET', href: '/tickets' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-800 text-2xl font-semibold hover:scale-110 transition"
            >
              {item.name}
            </a>
          ))}
          <NavUserMenu />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="md:hidden flex flex-col items-start mt-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {[
                { name: 'DASHBOARD', href: '/' },
                { name: 'DATABASE', href: '/database' },
                { name: 'ASSET', href: '/assets' },
                { name: 'TICKET', href: '/tickets' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 text-base font-semibold hover:scale-110 transition"
                >
                  {item.name}
                </a>
              ))}
              <NavUserMenu />
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Modals */}
        <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
        <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
        <ChangeAvatarModal open={showChangeAvatar} onClose={() => setShowChangeAvatar(false)} />

        {/* Logout Confirmation */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
            // fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-opacity duration-300 ease-in-out animate-modalFadeIn
              className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                <p className="mb-4 text-lg font-semibold">Are you sure you want to log out?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
