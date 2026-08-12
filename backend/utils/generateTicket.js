import Complaint from "../models/Complaint.js";

export const generateTicketNumber = async () => {
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const countThisYear = await Complaint.countDocuments({
    createdAt: { $gte: start, $lt: end },
  });

  const sequence = String(countThisYear + 1).padStart(6, "0");
  const ticketNumber = `PLT-${year}-${sequence}`;

  const exists = await Complaint.exists({ ticketNumber });
  if (exists) {
    const fallbackSeq = String(countThisYear + 1 + Math.floor(Math.random() * 100)).padStart(6, "0");
    return `PLT-${year}-${fallbackSeq}`;
  }

  return ticketNumber;
};
