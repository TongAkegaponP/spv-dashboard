'use client';
import React from 'react';

export default function TextAvatar({ username }: { username?: string }) {
  const initial = username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
      {initial}
    </div>
  );
}