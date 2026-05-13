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

    try {
      await deleteUser(id)
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <p className="mt-2 opacity-90">
          Consultez, recherchez et gérez les comptes utilisateurs.
        </p>
      </div>

      {error && (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      <Card>
        <input
          type="text"
          placeholder="Rechercher par nom, email ou rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </Card>

      <Card>
        {filteredUsers.length === 0 ? (
          <p className="text-slate-500">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {user.full_name || "Utilisateur sans nom"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Utilisateur {index + 1}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Actif
                  </span>

                  <Button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminUsers