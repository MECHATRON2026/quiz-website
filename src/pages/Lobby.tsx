import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Lobby: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Lobby</h1>
        <p className="text-gray-600">
          The quiz round will begin shortly. Please wait for the administrator to start the event.
        </p>
        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Enter Quiz
        </button>
      </div>
    </div>
  );
};