import { NavLink } from "react-router-dom"

const AdminSidebar = () => {
  const links = [
    { path: "/admin-dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/admin-users", label: "Users", icon: "👥" },
    { path: "/admin-analyses", label: "Analyses", icon: "🧪" },
    { path: "/admin-reports", label: "Reports", icon: "📄" },
    { path: "/admin-statistics", label: "Statistics", icon: "📊" },
    { path: "/admin/profile", label: "Profile", icon: "👤" },
  ]

  return (
    <aside className="w-64 min-h-screen bg-blue-950 text-white p-5">
      <div className="mb-10">
        <h1 className="text-xl font-bold">Smart Medical App</h1>
        <p className="text-sm text-blue-200">Admin Panel</p>
      </div>

      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-100 hover:bg-blue-900"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar