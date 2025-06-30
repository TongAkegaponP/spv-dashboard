'use client';
import React from 'react';

export default function TextAvatar({ name }: { name?: string }) {
  const initial = name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
      {initial}
    </div>
  );
}
