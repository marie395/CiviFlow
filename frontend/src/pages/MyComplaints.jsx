import { useEffect, useState } from "react";
import api from "../services/api.js";
import ComplaintCard from "../components/ComplaintCard.jsx";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/complaints/mine")
      .then(({ data }) => setComplaints(data.complaints))
      .catch((err) => setError(err.response?.data?.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Mes plaintes</h1>
      <p className="text-slate text-sm mb-8">Historique de toutes vos démarches.</p>

      {loading && <p className="text-slate">Chargement…</p>}
      {error && <p className="text-rust-dark">{error}</p>}
      {!loading && complaints.length === 0 && (
        <div className="bg-white border border-ink/10 rounded-sm p-8 text-center">
          <p className="text-slate">Vous n'avez soumis aucune plainte pour le moment.</p>
        </div>
      )}

      <div className="space-y-3">
        {complaints.map((c) => (
          <ComplaintCard key={c._id} complaint={c} />
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;
