import { useEffect, useState } from "react";
import api from "../services/api.js";
import ComplaintCard from "../components/ComplaintCard.jsx";
import { CATEGORIES, STATUSES } from "../constants.js";
import { useAuth } from "../context/AuthContext.jsx";

const AuthorityDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    api
      .get("/complaints", { params })
      .then(({ data }) => {
        setComplaints(data.complaints);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchComplaints, [filters]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Panneau autorité</h1>
      <p className="text-slate text-sm mb-8">
        {user?.role === "admin" ? "Toutes les plaintes du système" : "Plaintes de votre service"} · {total} au total
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
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
      </div>

      {loading && <p className="text-slate">Chargement…</p>}

      <div className="space-y-3">
        {complaints.map((c) => (
          <ComplaintCard key={c._id} complaint={c} />
        ))}
        {!loading && complaints.length === 0 && (
          <div className="bg-white border border-ink/10 rounded-sm p-8 text-center text-slate">
            Aucune plainte ne correspond à ces filtres.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
