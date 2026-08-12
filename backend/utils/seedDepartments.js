import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Department from "../models/Department.js";

dotenv.config();

const departments = [
  { name: "Direction de la Voirie", categories: ["Voirie & Routes"], contactEmail: "voirie@services-publics.gouv" },
  { name: "Office de l'Eau et Assainissement", categories: ["Eau & Assainissement"], contactEmail: "eau@services-publics.gouv" },
  { name: "Société Nationale d'Électricité", categories: ["Électricité"], contactEmail: "electricite@services-publics.gouv" },
  { name: "Ministère de la Santé Publique", categories: ["Santé Publique"], contactEmail: "sante@services-publics.gouv" },
  { name: "Direction de la Sécurité Publique", categories: ["Sécurité"], contactEmail: "securite@services-publics.gouv" },
  { name: "Ministère de l'Éducation", categories: ["Éducation"], contactEmail: "education@services-publics.gouv" },
  { name: "Régie des Transports Publics", categories: ["Transport Public"], contactEmail: "transport@services-publics.gouv" },
  { name: "Agence de l'Environnement", categories: ["Environnement & Déchets"], contactEmail: "environnement@services-publics.gouv" },
  { name: "Inspection Générale d'État", categories: ["Corruption & Ethique"], contactEmail: "ethique@services-publics.gouv" },
  { name: "Guichet Unique (Divers)", categories: ["Autre"], contactEmail: "contact@services-publics.gouv" },
];

const run = async () => {
  await connectDB();
  for (const dept of departments) {
    await Department.findOneAndUpdate({ name: dept.name }, dept, { upsert: true, new: true });
  }
  console.log(` ${departments.length} services créés/actualisés.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
