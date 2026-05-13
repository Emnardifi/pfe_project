import { useState } from "react"

import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"

import { useAdmin } from "../hooks/useAdmin"

const AdminAnalyses = () => {
  const { analyses, loading, error, deleteAnalysis } = useAdmin()
  const [search, setSearch] = useState("")

  const filteredAnalyses = analyses.filter((analysis) =>
    analysis.prediction?.toLowerCase().includes(search.toLowerCase()) ||
    analysis.status?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette analyse ?")) return

    try {
      await deleteAnalysis(id)
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
  }

  const getPredictionBadge = (prediction) => {
    if (prediction === "PNEUMONIA") {
      return "bg-red-100 text-red-700"
    }

    if (prediction === "NORMAL") {
      return "bg-emerald-100 text-emerald-700"
    }

    return "bg-slate-100 text-slate-700"
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Gestion des analyses</h1>
        <p className="mt-2 opacity-90">
          Consultez et gérez les analyses médicales des utilisateurs.
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
          placeholder="Rechercher par résultat ou statut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </Card>

      <Card>
        {filteredAnalyses.length === 0 ? (
          <p className="text-slate-500">Aucune analyse trouvée.</p>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis, index) => (
              <div
                key={analysis.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Analyse médicale {index + 1}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Utilisateur concerné : Utilisateur {analysis.user_id}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Confiance :{" "}
                    {analysis.probability
                      ? `${Math.round(analysis.probability * 100)}%`
                      : "Non disponible"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getPredictionBadge(
                      analysis.prediction
                    )}`}
                  >
                    {analysis.prediction || "Non disponible"}
                  </span>

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    {analysis.status || "En attente"}
                  </span>

                  <Button
                    onClick={() => handleDelete(analysis.id)}
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

export default AdminAnalyses