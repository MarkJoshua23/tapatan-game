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
        
        // Delay the actual game start to show the result
        setTimeout(() => {
          onResult(flipResult);
        }, 1000); // Wait 1 more second before transitioning to game
      }, 4000); // Wait for animation to complete (should match CSS animation duration)
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
      
      <div className="relative w-24 h-24 mb-6 perspective-1000">
        <div
          className={`coin w-full h-full transition-all duration-300 transform-style-3d ${
            isFlipping ? (result === 'O' ? 'animate-flip-O' : 'animate-flip-X') : ''
          }`}
          style={{
            transform: isFlipping
              ? (result === 'O' ? 'rotateY(1260deg)' : 'rotateY(1080deg)')
              : result === 'O' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Coin front - X side */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 backface-hidden"></div>
          
          {/* Coin back - O side */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 backface-hidden" style={{ transform: 'rotateY(180deg)' }}></div>
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