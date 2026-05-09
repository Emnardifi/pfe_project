import AdminSidebar from "./AdminSidebar"
import Navbar from "./Navbar"

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout