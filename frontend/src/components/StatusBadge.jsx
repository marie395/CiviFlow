const STYLES = {
  Soumise: "bg-slate/10 text-slate border-slate/30",
  "En cours d'examen": "bg-amber/10 text-amber-dark border-amber/40",
  "En traitement": "bg-ink/10 text-ink border-ink/30",
  Résolue: "bg-teal/10 text-teal-dark border-teal/40",
  Rejetée: "bg-rust/10 text-rust-dark border-rust/40",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium uppercase tracking-wide ${
      STYLES[status] || STYLES.Soumise
    }`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default StatusBadge;
