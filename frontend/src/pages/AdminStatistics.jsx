import Card from "../components/common/Card"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminStatistics = () => {
  const { stats, analyses, loading, error } = useAdmin()

  if (loading) return <Loading />

  const pneumoniaCount = analyses.filter(
    (a) => a.prediction === "PNEUMONIA"
  ).length

  const normalCount = analyses.filter(
    (a) => a.prediction === "NORMAL"
  ).length

  const total = analyses.length || 1

  const pneumoniaPercent = Math.round((pneumoniaCount / total) * 100)
  const normalPercent = Math.round((normalCount / total) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-slate-500">
          Statistiques globales de l’application.
        </p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Utilisateurs</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {stats?.users_count || 0}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Analyses</p>
          <h2 className="text-3xl font-bold text-emerald-600">
            {stats?.analyses_count || 0}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Rapports</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {stats?.reports_count || 0}
          </h2>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-bold">Répartition des résultats</h2>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <span>PNEUMONIA</span>
              <span>{pneumoniaPercent}%</span>
            </div>
            <div className="h-4 rounded-full bg-slate-100">
              <div
                className="h-4 rounded-full bg-red-500"
                style={{ width: `${pneumoniaPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between">
              <span>NORMAL</span>
              <span>{normalPercent}%</span>
            </div>
            <div className="h-4 rounded-full bg-slate-100">
              <div
                className="h-4 rounded-full bg-green-500"
                style={{ width: `${normalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminStatistics