import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Admin: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'violations' },
        (payload) => {
          setViolations((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data: teamData, error: teamErr } = await supabase.from('teams').select('*');
    const { data: violationData, error: violErr } = await supabase
      .from('violations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (teamErr) console.error('Teams Fetch Error:', teamErr);
    if (violErr) console.error('Violations Fetch Error:', violErr);

    if (teamData) setTeams(teamData);
    if (violationData) setViolations(violationData);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between">
            <span>Live Violations</span>
            <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-mono">
              {violations.length}
            </span>
          </h2>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {violations.map((v) => (
              <div key={v.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-red-600 block">{v.type}</span>
                  <span className="text-xs text-gray-400 font-mono">Team: {v.team_id}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(v.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between">
            <span>Registered Teams</span>
            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-mono">
              {teams.length}
            </span>
          </h2>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {teams.map((t) => (
              <div key={t.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800">{t.team_name}</p>
                  <p className="text-xs text-gray-500">{t.team_leader_email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};