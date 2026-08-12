const STEPS = ["Soumise", "En cours d'examen", "En traitement", "Résolue"];

const StatusStepper = ({ status, statusHistory = [] }) => {
  const isRejected = status === "Rejetée";
  const currentIndex = STEPS.indexOf(status);

  const dateFor = (step) => statusHistory.find((h) => h.status === step)?.changedAt;

  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const reached = !isRejected && i <= currentIndex;
          const isCurrent = !isRejected && i === currentIndex;
          return (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2 text-center min-w-[90px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-mono text-xs
                    ${
                      reached
                        ? isCurrent
                          ? "bg-ink border-ink text-parchment"
                          : "bg-teal border-teal text-parchment"
                        : "bg-white border-slate-light/40 text-slate-light"
                    }`}
                >
                  {reached && !isCurrent ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] leading-tight ${reached ? "text-ink font-medium" : "text-slate-light"}`}>
                  {step}
                </span>
                {dateFor(step) && (
                  <span className="text-[10px] text-slate-light font-mono">
                    {new Date(dateFor(step)).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex && !isRejected ? "bg-teal" : "bg-slate-light/30"}`} />
              )}
            </div>
          );
        })}
      </div>
      {isRejected && (
        <div className="mt-3 text-sm text-rust-dark bg-rust/10 border border-rust/30 rounded-sm px-3 py-2 inline-block">
          Cette plainte a été rejetée. Consultez la réponse officielle ci-dessous.
        </div>
      )}
    </div>
  );
};

export default StatusStepper;
