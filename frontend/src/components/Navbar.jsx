{/*import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-sm transition-colors focus-ring ${
    isActive ? "bg-ink text-parchment" : "text-ink hover:bg-ink/5"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStaff = ["agent", "authority", "admin"].includes(user?.role);

  return (
    <header className="bg-parchment border-b border-ink/10 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-sm bg-ink text-parchment font-display font-semibold flex items-center justify-center text-sm">
            R
          </span>
          <span className="font-display text-lg text-ink leading-none">
            Registre Civique
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/public" className={linkClass}>Tableau public</NavLink>
          <NavLink to="/suivi" className={linkClass}>Suivre une plainte</NavLink>
          {user && !isStaff && (
            <>
              <NavLink to="/nouvelle-plainte" className={linkClass}>Déposer une plainte</NavLink>
              <NavLink to="/mes-plaintes" className={linkClass}>Mes plaintes</NavLink>
            </>
          )}
          {isStaff && (
            <>
              <NavLink to="/autorite" className={linkClass}>Panneau autorité</NavLink>
              <NavLink to="/analytique" className={linkClass}>Analytique</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate">{user.fullName}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm font-medium text-rust-dark hover:underline focus-ring"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="text-sm font-medium text-ink hover:underline focus-ring">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="text-sm font-medium bg-ink text-parchment px-3 py-2 rounded-sm hover:bg-ink-light focus-ring"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
  */}
 import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaClipboardList,
  FaHome,
  FaChartBar,
  FaUsersCog,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const isStaff = ["agent", "authority", "admin"].includes(user?.role);
  const isAdmin = user?.role === "admin";

  const navLink = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-green-500/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              CF
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">CiviFlow</h1>
              <p className="text-xs text-gray-500">Gestion des Plaintes</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavLink to="/" className={navLink}>Accueil</NavLink>
            <NavLink to="/public" className={navLink}>Tableau Public</NavLink>
            <NavLink to="/suivi" className={navLink}>Suivi</NavLink>

            {!isStaff && user && (
              <>
                <NavLink to="/nouvelle-plainte" className={navLink}>Déposer</NavLink>
                <NavLink to="/mes-plaintes" className={navLink}>Mes Plaintes</NavLink>
              </>
            )}

            {isStaff && (
              <>
                <NavLink to="/autorite" className={navLink}>Autorité</NavLink>
                <NavLink to="/analytique" className={navLink}>Analytique</NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink to="/admin/personnel" className={navLink}>Personnel</NavLink>
            )}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-blue-600" size={26} />
                  <div>
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="font-medium hover:text-blue-600">
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-5 py-4 space-y-3">
            <NavLink to="/" className="flex items-center gap-2 text-gray-700">
              <FaHome />
              Accueil
            </NavLink>

            <NavLink to="/public" className="flex items-center gap-2 text-gray-700">
              <FaClipboardList />
              Tableau Public
            </NavLink>

            <NavLink to="/suivi" className="flex items-center gap-2 text-gray-700">
              <FaClipboardList />
              Suivi
            </NavLink>

            {!isStaff && user && (
              <>
                <NavLink to="/nouvelle-plainte" className="block text-gray-700">
                  Déposer une plainte
                </NavLink>
                <NavLink to="/mes-plaintes" className="block text-gray-700">
                  Mes plaintes
                </NavLink>
              </>
            )}

            {isStaff && (
              <>
                <NavLink to="/autorite" className="block text-gray-700">
                  Panneau Autorité
                </NavLink>
                <NavLink to="/analytique" className="flex items-center gap-2 text-gray-700">
                  <FaChartBar />
                  Analytique
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink to="/admin/personnel" className="flex items-center gap-2 text-gray-700">
                <FaUsersCog />
                Personnel
              </NavLink>
            )}

            <hr />

            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setOpen(false);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Déconnexion
              </button>
            ) : (
              <div className="space-y-2">
                <Link to="/connexion" className="block text-center border rounded-lg py-2">
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="block text-center bg-blue-600 text-white rounded-lg py-2"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
