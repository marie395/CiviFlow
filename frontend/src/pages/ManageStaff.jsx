import { useEffect, useState } from "react";
import api from "../services/api.js";

const ROLES = [
  { value: "agent", label: "Agent (traite les plaintes de son service)" },
  { value: "authority", label: "Autorité (agent + assignation)" },
  { value: "admin", label: "Administrateur (accès complet)" },
];

const ManageStaff = () => {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "agent",
    department: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStaff = () => {
    api.get("/users").then(({ data }) => setStaff(data.users));
  };

  useEffect(() => {
    api.get("/departments").then(({ data }) => setDepartments(data.departments));
    loadStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.department) delete payload.department;
      await api.post("/users", payload);
      setSuccess(`Compte "${form.fullName}" créé avec succès (${form.role}).`);
      setForm({ fullName: "", email: "", phone: "", password: "", role: "agent", department: "" });
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (userId, isActive) => {
    await api.patch(`/users/${userId}/status`, { isActive });
    loadStaff();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Gestion du personnel</h1>
      <p className="text-slate text-sm mb-8">
        Créer des comptes agent, autorité ou administrateur. Réservé aux administrateurs.
      </p>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust-dark text-sm rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-teal/10 border border-teal/30 text-teal-dark text-sm rounded-sm px-3 py-2 mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-sm p-6 space-y-4 mb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Nom complet</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Téléphone</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Mot de passe temporaire</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Rôle</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus-ring outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">
              Service {form.role !== "admin" && "(recommandé)"}
            </label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white focus-ring outline-none"
            >
              <option value="">Aucun</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-parchment px-5 py-2.5 rounded-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
        >
          {loading ? "Création…" : "Créer le compte"}
        </button>
      </form>

      <h2 className="font-display text-xl text-ink mb-4">Comptes existants</h2>
      <div className="bg-white border border-ink/10 rounded-sm divide-y divide-ink/5">
        {staff.map((u) => (
          <div key={u._id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-ink font-medium">{u.fullName}</p>
              <p className="text-xs text-slate">
                {u.email} · {u.role}{u.department ? ` · ${u.department.name}` : ""}
              </p>
            </div>
            <button
              onClick={() => toggleActive(u._id, !u.isActive)}
              className={`text-xs font-medium px-3 py-1.5 rounded-sm border ${
                u.isActive
                  ? "border-rust/30 text-rust-dark hover:bg-rust/5"
                  : "border-teal/30 text-teal-dark hover:bg-teal/5"
              }`}
            >
              {u.isActive ? "Désactiver" : "Réactiver"}
            </button>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-slate text-sm px-4 py-6 text-center">Aucun compte pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;
