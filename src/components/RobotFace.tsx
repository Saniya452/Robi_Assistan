
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RobotFaceProps {
  expression: 'idle' | 'happy' | 'surprised' | 'listening' | 'speaking' | 'thinking';
  isAnimating?: boolean;
}

const RobotFace: React.FC<RobotFaceProps> = ({ expression, isAnimating = false }) => {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthAnimation, setMouthAnimation] = useState(0);
  const blinkTimer = useRef<NodeJS.Timeout>();
  const mouthTimer = useRef<NodeJS.Timeout>();

  // Blinking animation
  useEffect(() => {
    const startBlinking = () => {
      blinkTimer.current = setTimeout(() => {
        setBlinkState(true);
        setTimeout(() => {
          setBlinkState(false);
          startBlinking();
        }, 150);
      }, Math.random() * 3000 + 2000);
    };

    if (expression !== 'surprised') {
      startBlinking();
    }

    return () => {
      if (blinkTimer.current) {
        clearTimeout(blinkTimer.current);
      }
    };
  }, [expression]);

  // Enhanced mouth animation for speaking
  useEffect(() => {
    if (expression === 'speaking' && isAnimating) {
      const animateMouth = () => {
        setMouthAnimation(prev => (prev + 1) % 4);
        mouthTimer.current = setTimeout(animateMouth, 150);
      };
      animateMouth();
    } else {
      setMouthAnimation(0);
    }

    return () => {
      if (mouthTimer.current) {
        clearTimeout(mouthTimer.current);
      }
    };
  }, [expression, isAnimating]);

  const getEyeSize = () => {
    switch (expression) {
      case 'surprised':
        return 'w-20 h-20';
      case 'happy':
        return 'w-16 h-12';
      case 'listening':
        return 'w-16 h-16';
      default:
        return 'w-16 h-16';
    }
  };

  const getEyeShape = () => {
    if (blinkState && expression !== 'surprised') {
      return 'h-1';
    }
    switch (expression) {
      case 'happy':
        return 'rounded-full';
      case 'surprised':
        return 'rounded-full';
      default:
        return 'rounded-full';
    }
  };

  const getMouthShape = () => {
    switch (expression) {
      case 'happy':
        return 'w-16 h-8 border-b-4 border-gray-700 rounded-b-full';
      case 'surprised':
        return 'w-6 h-8 bg-gray-700 rounded-full';
      case 'speaking':
        // Dynamic mouth shapes for speaking animation
        const shapes = [
          'w-12 h-6 bg-gray-700 rounded-full',
          'w-8 h-8 bg-gray-700 rounded-full',
          'w-14 h-4 bg-gray-700 rounded-full',
          'w-10 h-6 bg-gray-700 rounded-full'
        ];
        return `${shapes[mouthAnimation]} transition-all duration-150`;
      case 'listening':
        return 'w-8 h-2 bg-gray-700 rounded-full';
      case 'thinking':
        return 'w-10 h-2 bg-gray-700 rounded-full';
      default:
        return 'w-8 h-2 bg-gray-700 rounded-full';
    }
  };

  return (
    <div className={cn(
      "relative w-80 h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl shadow-2xl border-4 border-white transition-all duration-500",
      isAnimating && "animate-pulse"
    )}>
      {/* Robot head glow effect */}
      <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl opacity-60"></div>
      
      {/* Eyes container */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex space-x-8">
        {/* Left eye */}
        <div className={cn(
          "bg-gray-800 transition-all duration-300 flex items-center justify-center",
          getEyeSize(),
          getEyeShape()
        )}>
          {!blinkState && (
            <div className="w-4 h-4 bg-white rounded-full relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Right eye */}
        <div className={cn(
          "bg-gray-800 transition-all duration-300 flex items-center justify-center",
          getEyeSize(),
          getEyeShape()
        )}>
          {!blinkState && (
            <div className="w-4 h-4 bg-white rounded-full relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced mouth with better animations */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className={cn("transition-all duration-300", getMouthShape())}>
          {/* Add teeth/inner mouth detail for speaking */}
          {expression === 'speaking' && (
            <div className="absolute inset-1 bg-pink-200 rounded-full opacity-60"></div>
          )}
        </div>
      </div>

      {/* Listening indicator */}
      {expression === 'listening' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Thinking indicator */}
      {expression === 'thinking' && (
        <div className="absolute top-6 right-6">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      )}

      {/* Heart eyes when very happy */}
      {expression === 'happy' && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex space-x-8 pointer-events-none">
          <div className="w-4 h-4 text-red-500 animate-pulse">❤️</div>
          <div className="w-4 h-4 text-red-500 animate-pulse" style={{ animationDelay: '0.2s' }}>❤️</div>
        </div>
      )}
    </div>
  );
};

export default RobotFace;
