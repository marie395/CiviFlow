import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-1">Connexion</h1>
      <p className="text-slate text-sm mb-8">Accédez à votre espace citoyen ou agent.</p>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust-dark text-sm rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="text-sm font-medium text-ink block mb-1">Mot de passe</label>
          <input
            type="password"
            required
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
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        Pas encore de compte ?{" "}
        <Link to="/inscription" className="text-ink font-medium hover:underline">
          Créer un compte citoyen
        </Link>
      </p>
    </div>
  );
};

export default Login;
