import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const ComplaintCard = ({ complaint, to }) => (
  <Link
    to={to || `/plaintes/${complaint._id}`}
    className="block bg-white border border-ink/10 rounded-sm px-4 py-3 hover:border-ink/30 hover:shadow-sm transition-all focus-ring"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-slate-light">{complaint.ticketNumber}</p>
        <p className="font-display text-ink truncate">{complaint.title}</p>
        <p className="text-xs text-slate mt-0.5">
          {complaint.category}
          {complaint.location?.address ? ` · ${complaint.location.address}` : ""}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusBadge status={complaint.status} />
        <span className="text-[11px] text-slate-light">
          {new Date(complaint.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  </Link>
);

export default ComplaintCard;
