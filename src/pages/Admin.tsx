import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Admin: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();

    // Subscribe to realtime violations
    const channel = supabase
      .channel('violations-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'violations' }, (payload) => {
        setViolations((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data: teamData } = await supabase.from('teams').select('*');
    const { data: violationData } = await supabase.from('violations').select('*').order('timestamp', { ascending: false });

    if (teamData) setTeams(teamData);
    if (violationData) setViolations(violationData);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Live Violations ({violations.length})</h2>
        <div className="max-h-60 overflow-y-auto divide-y">
          {violations.map((v) => (
            <div key={v.id} className="py-2 flex justify-between text-sm">
              <span className="font-semibold text-red-600">{v.type}</span>
              <span>Team ID: {v.team_id}</span>
              <span className="text-gray-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Teams ({teams.length})</h2>
        <div className="divide-y">
          {teams.map((t) => (
            <div key={t.id} className="py-2 flex justify-between text-sm">
              <span>{t.team_name} ({t.team_leader_email})</span>
              <span className="font-mono">{t.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};