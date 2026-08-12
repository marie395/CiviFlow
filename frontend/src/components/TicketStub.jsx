import StatusBadge from "./StatusBadge.jsx";

/**
 * Élément signature de l'interface : le numéro de suivi est présenté comme
 * un ticket officiel perforé, à l'image d'un accusé de réception administratif.
 */
const TicketStub = ({ ticketNumber, title, category, status, date }) => {
  return (
    <div className="flex items-stretch bg-white shadow-sm border border-ink/10 rounded-sm overflow-hidden max-w-md">
      <div className="bg-ink text-parchment px-4 py-5 flex flex-col items-center justify-center min-w-[92px]">
        <span className="font-display text-[10px] uppercase tracking-[0.2em] text-parchment/70">
          Ticket
        </span>
        <span className="font-mono text-xs mt-1 rotate-0 text-center leading-tight break-all">
          {ticketNumber}
        </span>
      </div>
      <div className="perforated-edge flex-1 px-5 py-4">
        {title && (
          <p className="font-display text-ink text-base leading-snug mb-1">{title}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate">
          {category && <span>{category}</span>}
          {date && <span>· {new Date(date).toLocaleDateString("fr-FR")}</span>}
        </div>
        {status && (
          <div className="mt-2">
            <StatusBadge status={status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketStub;
