# Registre Civique — Système de Gestion des Plaintes des Services Publics

Stack **MERN** (MongoDB, Express, React, Node.js).

## Structure

```
complaint-system/
├── backend/     API REST (Express + MongoDB/Mongoose)
└── frontend/    Interface React (Vite + Tailwind)
```

## Rôles

| Rôle        | Peut faire |
|-------------|------------|
| `citizen`   | S'inscrire, soumettre des plaintes, suivre ses plaintes |
| `agent`     | Voir/traiter les plaintes de son service, changer le statut, répondre |
| `authority` | Idem agent + assigner les plaintes à un agent/service |
| `admin`     | Tout, + créer des comptes agent/authority/admin, gérer les services |

## Démarrage rapide

Voir les instructions détaillées fournies séparément pour l'installation
(MongoDB, backend, frontend). En résumé :

```bash
# Backend
cd backend
cp .env.example .env   # puis remplir MONGO_URI et JWT_SECRET
npm install
npm run seed            # crée les 10 services publics par défaut
npm run dev              # http://localhost:5000

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Créer le premier compte administrateur

Il n'existe pas de route publique pour créer un compte `admin` (sécurité).
Après avoir créé un compte via `/inscription`, passez-le en `admin` directement
dans MongoDB :

```js
// mongosh
use complaint_system
db.users.updateOne({ email: "vous@example.com" }, { $set: { role: "admin" } })
```

Connectez-vous ensuite avec ce compte et utilisez `POST /api/users` pour créer
les comptes `agent`/`authority` réels, en leur assignant un `department`
(voir `GET /api/departments` pour la liste des IDs).

## Points clés de l'implémentation

- **Numéro de suivi** : généré automatiquement (`PLT-ANNÉE-000123`), unique par année.
- **Routage automatique** : chaque catégorie de plainte est mappée à un service (`Department.categories`).
- **Workflow de statut** : Soumise → En cours d'examen → En traitement → Résolue (ou Rejetée), avec historique complet et horodatage.
- **Notifications** : email (Nodemailer) + point d'intégration SMS (Twilio à activer dans `backend/utils/notify.js`).
- **Tableau de bord public** : `GET /api/complaints/public`, aucune donnée d'identité du plaignant n'est exposée.
- **Analytique** : taux de résolution, délai moyen, répartition par catégorie/service, tendance mensuelle.
