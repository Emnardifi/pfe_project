import Card from "../components/common/Card"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminStatistics = () => {
  const { stats, users, analyses, reports, loading, error } = useAdmin()

  if (loading) return <Loading />

  const totalUsers = stats?.users_count || users.length
  const totalAnalyses = stats?.analyses_count || analyses.length
  const totalReports = stats?.reports_count || reports.length

  const pneumoniaCount = analyses.filter(
    (a) => a.prediction === "PNEUMONIA"
  ).length

  const normalCount = analyses.filter(
    (a) => a.prediction === "NORMAL"
  ).length

  const total = analyses.length || 1

  const pneumoniaPercent = Math.round((pneumoniaCount / total) * 100)
  const normalPercent = Math.round((normalCount / total) * 100)

  const avgConfidence =
    analyses.length === 0
      ? 0
      : Math.round(
          analyses.reduce(
            (sum, a) => sum + (a.probability ? a.probability * 100 : 0),
            0
          ) / analyses.length
        )

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Statistiques</h1>
        <p className="mt-2 opacity-90">
          Analyse globale des utilisateurs, diagnostics et rapports PDF.
        </p>
      </div>

      {error && (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Utilisateurs</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {totalUsers}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Comptes enregistrés</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Analyses</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {totalAnalyses}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Diagnostics effectués</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Rapports</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {totalReports}
          </h2>
          <p className="mt-2 text-sm text-slate-500">PDF générés</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Confiance moyenne</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-600">
            {avgConfidence}%
          </h2>
          <p className="mt-2 text-sm text-slate-500">Basée sur les analyses</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-2 text-xl font-bold text-slate-900">
          Répartition des résultats
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          Distribution des diagnostics NORMAL et PNEUMONIA.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex items-center justify-center">
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#22c55e 0% ${normalPercent}%, #ef4444 ${normalPercent}% ${
                  normalPercent + pneumoniaPercent
                }%, #e5e7eb ${
                  normalPercent + pneumoniaPercent
                }% 100%)`,
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-bold">{totalAnalyses}</span>
                <span className="text-sm text-slate-500">Analyses</span>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="font-semibold text-red-600">PNEUMONIA</span>
                <span className="font-semibold">
                  {pneumoniaCount} cas ({pneumoniaPercent}%)
                </span>
              </div>

              <div className="h-4 rounded-full bg-slate-100">
                <div
                  className="h-4 rounded-full bg-red-500"
                  style={{ width: `${pneumoniaPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span className="font-semibold text-emerald-600">NORMAL</span>
                <span className="font-semibold">
                  {normalCount} cas ({normalPercent}%)
                </span>
              </div>

              <div className="h-4 rounded-full bg-slate-100">
                <div
                  className="h-4 rounded-full bg-emerald-500"
                  style={{ width: `${normalPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminStatistics