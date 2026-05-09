import { useState } from "react"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminUsers = () => {
  const { users, loading, error, deleteUser } = useAdmin()
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return
    await deleteUser(id)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-slate-500">Gestion des utilisateurs.</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Card>
        <input
          type="text"
          placeholder="Rechercher user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-2"
        />
      </Card>

      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-3">ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-3">{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminUsers