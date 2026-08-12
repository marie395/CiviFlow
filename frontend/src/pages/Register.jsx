import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/nouvelle-plainte");
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-1">Créer un compte citoyen</h1>
      <p className="text-slate text-sm mb-8">
        Nécessaire pour déposer et suivre vos plaintes de façon sécurisée.
      </p>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust-dark text-sm rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Pour les notifications SMS"
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block mb-1">Mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-parchment py-2.5 rounded-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        Déjà inscrit ?{" "}
        <Link to="/connexion" className="text-ink font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default Register;
