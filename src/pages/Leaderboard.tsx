import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('leaderboard').select('*');
    if (data) setLeaderboard(data);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Leaderboard</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {leaderboard.map((row, idx) => (
              <tr key={row.team_id || idx}>
                <td className="px-6 py-4 font-bold">{idx + 1}</td>
                <td className="px-6 py-4">{row.team_name}</td>
                <td className="px-6 py-4 font-mono font-semibold">{row.total_marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};