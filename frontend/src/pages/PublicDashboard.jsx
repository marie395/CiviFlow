import { useEffect, useState } from "react";
import api from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { CATEGORIES, STATUSES } from "../constants.js";

const PublicDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.status) params.status = filters.status;
    api
      .get("/complaints/public", { params })
      .then(({ data }) => {
        setComplaints(data.complaints);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Tableau de bord public</h1>
      <p className="text-slate text-sm mb-8">
        {total} plainte(s) partagées publiquement, sans identité du plaignant.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-ink/20 rounded-sm px-3 py-2 text-sm bg-white focus-ring outline-none"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-ink/20 rounded-sm px-3 py-2 text-sm bg-white focus-ring outline-none"
        >
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate">Chargement…</p>}

      <div className="space-y-2">
        {complaints.map((c) => (
          <div
            key={c.ticketNumber}
            className="flex items-center justify-between bg-white border border-ink/10 rounded-sm px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-slate-light">{c.ticketNumber}</p>
              <p className="font-display text-ink truncate">{c.title}</p>
              <p className="text-xs text-slate">
                {c.category}{c.location?.address ? ` · ${c.location.address}` : ""}
              </p>
            </div>
            <StatusBadge status={c.status} />
          </div>
        ))}
        {!loading && complaints.length === 0 && (
          <p className="text-slate text-center py-8">Aucune plainte ne correspond à ces filtres.</p>
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;
