'use client';

import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // Duration in minutes
  onTimeUp: () => void;
  isActive?: boolean;
}

export default function Timer({ duration, onTimeUp, isActive = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Show warning when 5 minutes or less remaining
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true);
        }
        
        // Time's up
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp, isWarning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return 'text-red-600'; // Last minute - red
    if (timeLeft <= 300) return 'text-yellow-600'; // Last 5 minutes - yellow
    return 'text-green-600'; // Normal - green
  };

  const getProgressPercentage = () => {
    const totalSeconds = duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className={`h-6 w-6 ${getTimerColor()}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Time Remaining</p>
            <p className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex flex-col items-end">
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${timeLeft <= 60 ? 'bg-red-100 text-red-800' : 
              timeLeft <= 300 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'}
          `}>
            {timeLeft <= 60 ? 'Critical' : 
             timeLeft <= 300 ? 'Warning' : 
             'Normal'}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft <= 60 ? 'bg-red-500' : 
              timeLeft <= 300 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Started</span>
          <span>{Math.round(getProgressPercentage())}% Complete</span>
        </div>
      </div>
      
      {/* Warning message */}
      {isWarning && timeLeft > 60 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ Less than 5 minutes remaining!
          </p>
        </div>
      )}
      
      {/* Critical warning */}
      {timeLeft <= 60 && timeLeft > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 font-medium">
            🚨 Less than 1 minute remaining!
          </p>
        </div>
      )}
    </div>
  );
}
