import { Link } from "react-router-dom"

const QuickActions = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Link
        to="/analyze"
        className="rounded-2xl bg-blue-600 p-5 text-center text-white shadow transition hover:scale-105"
      >
        🩻 Nouvelle analyse
      </Link>

      <Link
        to="/history"
        className="rounded-2xl bg-emerald-500 p-5 text-center text-white shadow transition hover:scale-105"
      >
        📊 Historique
      </Link>

      <Link
        to="/reports"
        className="rounded-2xl bg-slate-800 p-5 text-center text-white shadow transition hover:scale-105"
      >
        📄 Rapports
      </Link>

      <Link
        to="/profile"
        className="rounded-2xl bg-white p-5 text-center text-blue-600 shadow transition hover:scale-105"
      >
        👤 Profil
      </Link>
    </div>
  )
}

export default QuickActions