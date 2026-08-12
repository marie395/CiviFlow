import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import TicketStub from "../components/TicketStub.jsx";
import StatusStepper from "../components/StatusStepper.jsx";

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(searchParams.get("ticket") || "");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (value) => {
    const t = (value || ticket).trim();
    if (!t) return;
    setLoading(true);
    setError("");
    setComplaint(null);
    try {
      const { data } = await api.get(`/complaints/track/${encodeURIComponent(t)}`);
      setComplaint(data.complaint);
    } catch (err) {
      setError(err.response?.data?.message || "Plainte introuvable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("ticket")) search(searchParams.get("ticket"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-1">Suivre une plainte</h1>
      <p className="text-slate text-sm mb-8">
        Entrez le numéro de ticket reçu à la soumission (ex. PLT-2026-000123).
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        className="flex gap-2 mb-8"
      >
        <input
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder="PLT-2026-000123"
          className="flex-1 border border-ink/20 rounded-sm px-3 py-2 font-mono focus-ring outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-parchment px-5 py-2 rounded-sm font-medium hover:bg-ink-light disabled:opacity-60 focus-ring"
        >
          {loading ? "…" : "Rechercher"}
        </button>
      </form>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust-dark text-sm rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {complaint && (
        <div className="space-y-6">
          <TicketStub
            ticketNumber={complaint.ticketNumber}
            title={complaint.title}
            category={complaint.category}
            date={complaint.createdAt}
          />
          <div className="bg-white border border-ink/10 rounded-sm p-6">
            <StatusStepper status={complaint.status} statusHistory={complaint.statusHistory} />
          </div>
          {complaint.response?.text && (
            <div className="bg-teal/5 border border-teal/30 rounded-sm p-4">
              <p className="text-xs uppercase tracking-wide text-teal-dark font-medium mb-1">
                Réponse officielle
              </p>
              <p className="text-sm text-ink">{complaint.response.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;
