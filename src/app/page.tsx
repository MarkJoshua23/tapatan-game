'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Tapatan</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Traditional Filipino Three-in-a-Row Game</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-8">Choose Game Mode</h2>
          
          <div className="space-y-5">
            <Link 
              href="/tapatan"
              className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Single Player
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-50 dark:text-gray-400 text-sm">or</span>
              </div>
            </div>
            
            <Link
              href="/tapatan/multiplayer"
              className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Multiplayer
            </Link>
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Experience the traditional Filipino strategy game. Challenge an AI opponent or play with a friend.</p>
        </div>
      </div>
    </div>
  );
}
