import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import api from "../services/api.js";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/analytics/summary"), api.get("/analytics/trend")])
      .then(([s, t]) => {
        setSummary(s.data);
        setTrend(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-center py-16">Chargement des indicateurs…</p>;
  if (!summary) return null;

  const categoryData = summary.byCategory.map((c) => ({ name: c._id, plaintes: c.count }));

  const trendMap = {};
  (trend?.submitted || []).forEach((s) => {
    const key = `${s._id.y}-${s._id.m}`;
    trendMap[key] = { ...(trendMap[key] || {}), month: MONTHS[s._id.m - 1], soumises: s.count };
  });
  (trend?.resolved || []).forEach((r) => {
    const key = `${r._id.y}-${r._id.m}`;
    trendMap[key] = { ...(trendMap[key] || {}), month: MONTHS[r._id.m - 1], resolues: r.count };
  });
  const trendData = Object.values(trendMap);

  const statCards = [
    { label: "Total des plaintes", value: summary.total },
    { label: "Taux de résolution", value: `${summary.resolutionRate}%` },
    { label: "Délai moyen de résolution", value: summary.resolutionTime ? `${summary.resolutionTime.averageHours} h` : "—" },
    { label: "Résolues", value: summary.byStatus["Résolue"] || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Tableau de bord analytique</h1>
      <p className="text-slate text-sm mb-8">Indicateurs de performance et de résolution.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-ink/10 rounded-sm p-4">
            <p className="font-display text-2xl text-ink">{s.value}</p>
            <p className="text-xs text-slate-light mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-ink/10 rounded-sm p-5">
          <h2 className="font-display text-lg text-ink mb-4">Plaintes par catégorie</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e5e3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="plaintes" fill="#1B2A4A" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-ink/10 rounded-sm p-5">
          <h2 className="font-display text-lg text-ink mb-4">Tendance mensuelle (12 mois)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e5e3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="soumises" stroke="#E29A3C" strokeWidth={2} name="Soumises" />
              <Line type="monotone" dataKey="resolues" stroke="#0F766E" strokeWidth={2} name="Résolues" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {summary.byDepartment?.length > 0 && (
        <div className="bg-white border border-ink/10 rounded-sm p-5 mt-8">
          <h2 className="font-display text-lg text-ink mb-4">Performance par service</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-light text-xs uppercase tracking-wide">
                <th className="py-2">Service</th>
                <th className="py-2">Total</th>
                <th className="py-2">Résolues</th>
                <th className="py-2">Taux</th>
              </tr>
            </thead>
            <tbody>
              {summary.byDepartment.map((d) => (
                <tr key={d.department} className="border-t border-ink/5">
                  <td className="py-2 text-ink">{d.department}</td>
                  <td className="py-2">{d.total}</td>
                  <td className="py-2">{d.resolues}</td>
                  <td className="py-2 font-mono">{Math.round((d.resolues / d.total) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;
