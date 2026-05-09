import { useState } from "react"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminReports = () => {
  const { reports, loading, error, deleteReport } = useAdmin()
  const [search, setSearch] = useState("")

  const filteredReports = reports.filter((report) =>
    String(report.id).includes(search) ||
    String(report.analysis_id).includes(search) ||
    report.status?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce rapport ?")) return
    await deleteReport(id)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-slate-500">Tous les rapports générés.</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Card>
        <input
          type="text"
          placeholder="Rechercher rapport..."
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
              <th>Analyse</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="py-3">#{report.id}</td>
                <td>Analyse #{report.analysis_id}</td>
                <td>{report.status}</td>
                <td>
                  {report.generated_at
                    ? new Date(report.generated_at).toLocaleString()
                    : "—"}
                </td>
                <td>
                  <Button
                    onClick={() => handleDelete(report.id)}
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

export default AdminReports