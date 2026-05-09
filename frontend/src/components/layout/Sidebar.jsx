import { NavLink } from "react-router-dom"

const Sidebar = () => {
  const menu = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/analyze", label: "Nouvelle analyse", icon: "🩻" },
    { path: "/history", label: "Historique", icon: "📊" },
    { path: "/reports", label: "Rapports PDF", icon: "📄" },
    { path: "/profile", label: "Mon profil", icon: "👤" },
  ]

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }`

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-xl font-bold text-white">
          SM
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Smart Medical
          </h2>
          <p className="text-xs text-slate-500">
            AI X-ray diagnosis
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass}>
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-5 right-5 rounded-3xl bg-gradient-to-br from-blue-50 to-emerald-50 p-5">
        <p className="text-sm font-bold text-slate-800">
          Besoin d’analyse ?
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Importez une radiographie et obtenez un résultat intelligent.
        </p>
        <NavLink
          to="/analyze"
          className="mt-4 block rounded-xl bg-emerald-500 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Lancer analyse
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar