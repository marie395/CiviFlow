{/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TicketStub from "../components/TicketStub.jsx";
import StatusStepper from "../components/StatusStepper.jsx";
import { STATUSES } from "../constants.js";

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isStaff = ["agent", "authority", "admin"].includes(user?.role);

  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });
  const [responseText, setResponseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const load = () => {
    api
      .get(`/complaints/${id}`)
      .then(({ data }) => {
        setComplaint(data.complaint);
        setStatusForm({ status: data.complaint.status, note: "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Erreur de chargement"));
  };

  useEffect(load, [id]);

  const submitStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      await api.patch(`/complaints/${id}/status`, statusForm);
      setFeedback("Statut mis à jour et citoyen notifié.");
      load();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const submitResponse = async (markResolved) => {
    setSaving(true);
    setFeedback("");
    try {
      await api.post(`/complaints/${id}/response`, { text: responseText, markResolved });
      setFeedback(markResolved ? "Réponse enregistrée, plainte résolue." : "Réponse enregistrée.");
      setResponseText("");
      load();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="text-rust-dark text-center py-16">{error}</p>;
  if (!complaint) return <p className="text-slate text-center py-16">Chargement…</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <TicketStub
        ticketNumber={complaint.ticketNumber}
        title={complaint.title}
        category={complaint.category}
        date={complaint.createdAt}
      />

      <div className="bg-white border border-ink/10 rounded-sm p-6">
        <StatusStepper status={complaint.status} statusHistory={complaint.statusHistory} />
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Description</p>
          <p className="text-ink text-sm leading-relaxed">{complaint.description}</p>
        </div>

        {complaint.location?.address && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Lieu</p>
            <p className="text-sm text-ink">{complaint.location.address}</p>
          </div>
        )}
        {complaint.location?.latitude && (
          <a
            href={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink underline hover:no-underline"
          >
            Voir la position exacte sur la carte
          </a>
        )}

        {complaint.evidence?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-2">Preuves jointes</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.evidence.map((ev, i) =>
                ev.fileType === "video" ? (
                  <video key={i} src={ev.url} controls className="rounded-sm border border-ink/10 w-full h-32 object-cover" />
                ) : (
                  <img key={i} src={ev.url} alt={ev.originalName} className="rounded-sm border border-ink/10 w-full h-32 object-cover" />
                )
              )}
            </div>
          </div>
        )}

        {isStaff && complaint.citizen && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Plaignant</p>
            <p className="text-sm text-ink">
              {complaint.citizen.fullName} · {complaint.citizen.email} · {complaint.citizen.phone}
            </p>
          </div>
        )}

        {complaint.department && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Service assigné</p>
            <p className="text-sm text-ink">
              {complaint.department.name}
              {complaint.assignedAgent && ` · Agent : ${complaint.assignedAgent.fullName}`}
            </p>
          </div>
        )}
      </div>

      {complaint.response?.text && (
        <div className="bg-teal/5 border border-teal/30 rounded-sm p-4">
          <p className="text-xs uppercase tracking-wide text-teal-dark font-medium mb-1">Réponse officielle</p>
          <p className="text-sm text-ink">{complaint.response.text}</p>
        </div>
      )}

      {isStaff && (
        <div className="bg-white border border-ink/10 rounded-sm p-6 space-y-6">
          <h2 className="font-display text-lg text-ink">Gestion de la plainte</h2>

          {feedback && <p className="text-sm text-teal-dark">{feedback}</p>}

          <form onSubmit={submitStatus} className="space-y-3">
            <label className="text-sm font-medium text-ink block">Mettre à jour le statut</label>
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="border border-ink/20 rounded-sm px-3 py-2 text-sm bg-white focus-ring outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                placeholder="Note interne (optionnelle)"
                value={statusForm.note}
                onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                className="flex-1 min-w-[180px] border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring outline-none"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-ink text-parchment px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
              >
                Mettre à jour
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <label className="text-sm font-medium text-ink block">Réponse officielle / résolution</label>
            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Décrivez l'action prise ou la résolution apportée…"
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => submitResponse(false)}
                disabled={saving || !responseText}
                className="border border-ink/20 text-ink px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/5 disabled:opacity-60 focus-ring"
              >
                Enregistrer la réponse
              </button>
              <button
                onClick={() => submitResponse(true)}
                disabled={saving || !responseText}
                className="bg-teal text-parchment px-4 py-2 rounded-sm text-sm font-medium hover:bg-teal-dark disabled:opacity-60 focus-ring"
              >
                Enregistrer et marquer résolue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
*/}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TicketStub from "../components/TicketStub.jsx";
import StatusStepper from "../components/StatusStepper.jsx";
import { STATUSES } from "../constants.js";

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isStaff = ["agent", "authority", "admin"].includes(user?.role);

  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });
  const [responseText, setResponseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const load = () => {
    api
      .get(`/complaints/${id}`)
      .then(({ data }) => {
        setComplaint(data.complaint);
        setStatusForm({ status: data.complaint.status, note: "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Erreur de chargement"));
  };

  useEffect(load, [id]);

  const submitStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      await api.patch(`/complaints/${id}/status`, statusForm);
      setFeedback("Statut mis à jour et citoyen notifié.");
      load();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const submitResponse = async (markResolved) => {
    setSaving(true);
    setFeedback("");
    try {
      await api.post(`/complaints/${id}/response`, { text: responseText, markResolved });
      setFeedback(markResolved ? "Réponse enregistrée, plainte résolue." : "Réponse enregistrée.");
      setResponseText("");
      load();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="text-rust-dark text-center py-16">{error}</p>;
  if (!complaint) return <p className="text-slate text-center py-16">Chargement…</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <TicketStub
        ticketNumber={complaint.ticketNumber}
        title={complaint.title}
        category={complaint.category}
        date={complaint.createdAt}
      />

      <div className="bg-white border border-ink/10 rounded-sm p-6">
        <StatusStepper status={complaint.status} statusHistory={complaint.statusHistory} />
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Description</p>
          <p className="text-ink text-sm leading-relaxed">{complaint.description}</p>
        </div>

        {complaint.location?.address && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Lieu</p>
            <p className="text-sm text-ink">{complaint.location.address}</p>
          </div>
        )}
        {complaint.location?.latitude && (
          <a
            href={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink underline hover:no-underline"
          >
            Voir la position exacte sur la carte
          </a>
        )}

        {complaint.evidence?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-2">Preuves jointes</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.evidence.map((ev, i) => {
                // En production, ev.url est relatif ("/uploads/xxx") : on le prefixe
                // avec l'origine du backend (retire le "/api" final de VITE_API_URL).
                const apiBase = import.meta.env.VITE_API_URL || "";
                const origin = apiBase.replace(/\/api\/?$/, "");
                const fullUrl = ev.url.startsWith("http") ? ev.url : `${origin}${ev.url}`;
                return ev.fileType === "video" ? (
                  <video key={i} src={fullUrl} controls className="rounded-sm border border-ink/10 w-full h-32 object-cover" />
                ) : (
                  <img key={i} src={fullUrl} alt={ev.originalName} className="rounded-sm border border-ink/10 w-full h-32 object-cover" />
                );
              })}
            </div>
          </div>
        )}

        {isStaff && complaint.citizen && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Plaignant</p>
            <p className="text-sm text-ink">
              {complaint.citizen.fullName} · {complaint.citizen.email} · {complaint.citizen.phone}
            </p>
          </div>
        )}

        {complaint.department && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-light font-medium mb-1">Service assigné</p>
            <p className="text-sm text-ink">
              {complaint.department.name}
              {complaint.assignedAgent && ` · Agent : ${complaint.assignedAgent.fullName}`}
            </p>
          </div>
        )}
      </div>

      {complaint.response?.text && (
        <div className="bg-teal/5 border border-teal/30 rounded-sm p-4">
          <p className="text-xs uppercase tracking-wide text-teal-dark font-medium mb-1">Réponse officielle</p>
          <p className="text-sm text-ink">{complaint.response.text}</p>
        </div>
      )}

      {isStaff && (
        <div className="bg-white border border-ink/10 rounded-sm p-6 space-y-6">
          <h2 className="font-display text-lg text-ink">Gestion de la plainte</h2>

          {feedback && <p className="text-sm text-teal-dark">{feedback}</p>}

          <form onSubmit={submitStatus} className="space-y-3">
            <label className="text-sm font-medium text-ink block">Mettre à jour le statut</label>
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="border border-ink/20 rounded-sm px-3 py-2 text-sm bg-white focus-ring outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                placeholder="Note interne (optionnelle)"
                value={statusForm.note}
                onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                className="flex-1 min-w-[180px] border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring outline-none"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-ink text-parchment px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
              >
                Mettre à jour
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <label className="text-sm font-medium text-ink block">Réponse officielle / résolution</label>
            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Décrivez l'action prise ou la résolution apportée…"
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => submitResponse(false)}
                disabled={saving || !responseText}
                className="border border-ink/20 text-ink px-4 py-2 rounded-sm text-sm font-medium hover:bg-ink/5 disabled:opacity-60 focus-ring"
              >
                Enregistrer la réponse
              </button>
              <button
                onClick={() => submitResponse(true)}
                disabled={saving || !responseText}
                className="bg-teal text-parchment px-4 py-2 rounded-sm text-sm font-medium hover:bg-teal-dark disabled:opacity-60 focus-ring"
              >
                Enregistrer et marquer résolue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;