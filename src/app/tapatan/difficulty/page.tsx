'use client';

import React from 'react';
import Link from 'next/link';

const DifficultySelectionPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Tapatan</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Select Difficulty</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-8">Choose AI Difficulty</h2>
          
          <div className="space-y-5">
            <Link 
              href="/tapatan?difficulty=easy"
              className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Easy
            </Link>
            
            <Link 
              href="/tapatan?difficulty=medium"
              className="block w-full py-4 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              Medium
            </Link>
            
            <Link 
              href="/tapatan?difficulty=hard"
              className="block w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Hard
            </Link>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Link 
            href="/"
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionPage;