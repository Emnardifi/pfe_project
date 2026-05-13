import { NavLink } from "react-router-dom"

const AdminSidebar = () => {
  const links = [
    {
      path: "/admin-dashboard",
      label: "Tableau de bord",
      icon: "🏠",
    },
    {
      path: "/admin-users",
      label: "Utilisateurs",
      icon: "👥",
    },
    {
      path: "/admin-analyses",
      label: "Analyses",
      icon: "🧪",
    },
    {
      path: "/admin-reports",
      label: "Rapports",
      icon: "📄",
    },
    {
      path: "/admin-statistics",
      label: "Statistiques",
      icon: "📊",
    },
    {
      path: "/admin/profile",
      label: "Profil",
      icon: "👤",
    },
  ]

  return (
    <aside className="min-h-screen w-64 bg-blue-950 p-5 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          Smart Medical App
        </h1>

        <p className="text-sm text-blue-200">
          Espace administrateur
        </p>
      </div>

      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-900"
              }`
            }
          >
            <span className="text-lg">
              {link.icon}
            </span>

            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar