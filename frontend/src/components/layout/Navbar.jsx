import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const Navbar = () => {
  const { user, logout } = useAuth()

  const firstLetter = user?.full_name?.charAt(0)?.toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-slate-500">Espace utilisateur</p>
          <h1 className="text-xl font-bold text-slate-900">
            Smart Medical App
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 hover:bg-slate-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {firstLetter}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "Utilisateur"}
              </p>
              <p className="text-xs text-slate-500">
                Voir profil
              </p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar