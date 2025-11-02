import React, { useState, useEffect } from 'react';

interface CoinTossProps {
  onResult: (result: 'X' | 'O') => void;
}

const CoinToss: React.FC<CoinTossProps> = ({ onResult }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'X' | 'O' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    setShowResult(false);
    setResult(null);
    
    // Simulate coin flip animation
    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? 'X' : 'O';
      setResult(flipResult);
      
      // Show result after animation
      setTimeout(() => {
        setIsFlipping(false);
        setShowResult(true);
        onResult(flipResult);
      }, 1500);
    }, 100);
  };

  useEffect(() => {
    // Automatically trigger coin flip when component mounts
    const timer = setTimeout(() => {
      flipCoin();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Coin Toss</h3>
      
      <div className="relative w-24 h-24 mb-6">
        <div 
          className={`w-full h-full rounded-full flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ${
            result === 'X' ? 'bg-blue-600' : result === 'O' ? 'bg-red-600' : 'bg-gray-400'
          } ${isFlipping ? 'animate-spin' : ''}`}
        >
          {isFlipping ? '?' : result === 'X' ? 'X' : result === 'O' ? 'O' : '?'}
        </div>
      </div>
      
      {showResult && (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {result === 'X' ? 'You go first!' : 'AI goes first!'}
          </p>
        </div>
      )}
      
      {!showResult && (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Flipping coin...
        </p>
      )}
    </div>
  );
};

export default CoinToss;