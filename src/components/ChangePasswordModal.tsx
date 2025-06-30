'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPass !== confirm) {
      return setError('New password and confirmation do not match');
    }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: user.username,
            oldPass,
            newPass
        }),
        });
      if (res.ok) {
        onClose();
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to change password');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        // bg-opacity-50 backdrop-blur-sm
        <motion.div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white p-6 rounded shadow-lg w-80"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            {error && <p className="mb-2 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                required
                value={oldPass}
                onChange={e => setOldPass(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
