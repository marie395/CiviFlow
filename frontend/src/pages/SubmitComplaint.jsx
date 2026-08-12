import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { CATEGORIES } from "../constants.js";
import TicketStub from "../components/TicketStub.jsx";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    address: "",
    isPublic: true,
  });
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | loading | done | error
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeoStatus("done");
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (coords) {
        data.append("latitude", coords.latitude);
        data.append("longitude", coords.longitude);
      }
      files.forEach((f) => data.append("evidence", f));

      const { data: res } = await api.post("/complaints", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCreated(res.complaint);
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la soumission de la plainte");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark mb-4">
          Plainte enregistrée
        </p>
        <div className="flex justify-center mb-6">
          <TicketStub
            ticketNumber={created.ticketNumber}
            title={created.title}
            category={created.category}
            status={created.status}
            date={created.createdAt}
          />
        </div>
        <p className="text-slate text-sm mb-8">
          Conservez ce numéro : il vous permet de suivre l'avancement de votre plainte,
          même sans être connecté.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/mes-plaintes")}
            className="bg-ink text-parchment px-4 py-2 rounded-sm font-medium hover:bg-ink-light focus-ring"
          >
            Voir mes plaintes
          </button>
          <button
            onClick={() => navigate(`/suivi?ticket=${created.ticketNumber}`)}
            className="border border-ink/20 text-ink px-4 py-2 rounded-sm font-medium hover:bg-ink/5 focus-ring"
          >
            Suivre ce ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Déposer une plainte</h1>
      <p className="text-slate text-sm mb-8">
        Un numéro de suivi unique vous sera attribué à la soumission.
      </p>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust-dark text-sm rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-ink block mb-1">Titre</label>
          <input
            required
            maxLength={150}
            placeholder="Ex. Fuite d'eau non réparée depuis 2 semaines"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-xs text-slate-light mt-1">
            Détermine le service public automatiquement chargé du dossier.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Description détaillée</label>
          <textarea
            required
            rows={5}
            maxLength={3000}
            placeholder="Décrivez le problème : depuis quand, où précisément, impact sur vous ou votre quartier…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Adresse ou lieu</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Ex. Quartier Bastos, rue 1.750"
            className="w-full border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none"
          />
          <button
            type="button"
            onClick={detectLocation}
            className="mt-2 text-sm text-ink underline hover:no-underline focus-ring"
          >
            {geoStatus === "loading" ? "Localisation en cours…" : "📍 Utiliser ma position actuelle"}
          </button>
          {geoStatus === "done" && coords && (
            <p className="text-xs text-teal-dark mt-1 font-mono">
              Position enregistrée : {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
          {geoStatus === "error" && (
            <p className="text-xs text-rust-dark mt-1">
              Localisation indisponible — vous pouvez continuer avec l'adresse texte.
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">
            Preuves (photos ou vidéos, jusqu'à 5 fichiers)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFiles}
            className="w-full text-sm border border-ink/20 rounded-sm px-3 py-2 focus-ring outline-none file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:bg-ink/5 file:text-ink file:text-sm"
          />
          {files.length > 0 && (
            <p className="text-xs text-slate-light mt-1">{files.length} fichier(s) sélectionné(s)</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            className="focus-ring"
          />
          Rendre cette plainte visible (anonymement) sur le tableau de bord public
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-parchment py-3 rounded-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
        >
          {loading ? "Envoi en cours…" : "Soumettre la plainte"}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
