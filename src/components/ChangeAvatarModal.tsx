'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangeAvatarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangeAvatarModal({ open, onClose }: ChangeAvatarModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ username?: string; avatar?: string }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError('Please select an image.');
    if (!user.username) return setError('User not found in localStorage');

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('username', user.username);

    setLoading(true);
    try {
      const res = await fetch('/api/user/change-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...user, avatar: data.avatar };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        setError(data.error || 'Failed to upload avatar');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user.username) return setError('User not found in localStorage');

    setLoading(true);
    try {
      const res = await fetch('/api/user/change-avatar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });

      if (res.ok) {
        const updatedUser = { ...user, avatar: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to remove avatar');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(e.target.files?.[0] || null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl w-80 sm:w-96"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Change Avatar</h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:bg-gray-100 hover:file:bg-gray-200 hover:cursor-pointer"
              />

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 hover:cursor-pointer"
                >
                  Remove Avatar
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 hover:cursor-pointer"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
