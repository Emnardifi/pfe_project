import { useState } from "react"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminAnalyses = () => {
  const { analyses, loading, error, deleteAnalysis } = useAdmin()
  const [search, setSearch] = useState("")

  const filteredAnalyses = analyses.filter((analysis) =>
    String(analysis.id).includes(search) ||
    String(analysis.user_id).includes(search) ||
    analysis.prediction?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette analyse ?")) return
    await deleteAnalysis(id)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analyses</h1>
        <p className="text-slate-500">Liste de toutes les analyses.</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Card>
        <input
          type="text"
          placeholder="Rechercher analyse..."
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
              <th>User ID</th>
              <th>Résultat</th>
              <th>Confiance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAnalyses.map((analysis) => (
              <tr key={analysis.id} className="border-b">
                <td className="py-3">#{analysis.id}</td>
                <td>{analysis.user_id}</td>
                <td>{analysis.prediction}</td>
                <td>
                  {analysis.probability
                    ? `${Math.round(analysis.probability * 100)}%`
                    : "—"}
                </td>
                <td>{analysis.status || "—"}</td>
                <td>
                  <Button
                    onClick={() => handleDelete(analysis.id)}
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

export default AdminAnalyses