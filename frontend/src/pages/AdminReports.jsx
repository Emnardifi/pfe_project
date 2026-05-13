import { useState } from "react"

import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"

import { useAdmin } from "../hooks/useAdmin"

const AdminReports = () => {
  const { reports, loading, error, deleteReport } = useAdmin()
  const [search, setSearch] = useState("")

  const filteredReports = reports.filter((report) =>
    report.status?.toLowerCase().includes(search.toLowerCase()) ||
    report.generated_at?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce rapport ?")) return

    try {
      await deleteReport(id)
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
  }

  const formatDate = (date) => {
    if (!date) return "Date non disponible"

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Gestion des rapports</h1>
        <p className="mt-2 opacity-90">
          Consultez et supprimez les rapports PDF générés.
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
          placeholder="Rechercher par statut ou date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <Card>
          {filteredReports.length === 0 ? (
            <p className="text-slate-500">Aucun rapport trouvé.</p>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <div
                  key={report.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Rapport PDF {index + 1}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Analyse liée : Analyse {index + 1}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Généré le : {formatDate(report.generated_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                      {report.status || "Non disponible"}
                    </span>

                    <Button
                      onClick={() => handleDelete(report.id)}
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
      )}
    </div>
  )
}

export default AdminReports