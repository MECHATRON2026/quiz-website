import React from 'react';
import questions from '../data/questions.json';
import { useAntiCheat } from '../hooks/useAntiCheat';

export const Quiz: React.FC = () => {
  const teamId = localStorage.getItem('team_token');
  
  // Enable anti-cheat monitoring
  useAntiCheat(teamId);

  const question = questions[0];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Quiz Page</h1>
      <p className="mt-2">{question.question_text}</p>
      <ul className="mt-2">
        {question.options?.map((opt) => (
          <li key={opt}>{opt}</li>
        ))}
      </ul>
    </div>
  );
};