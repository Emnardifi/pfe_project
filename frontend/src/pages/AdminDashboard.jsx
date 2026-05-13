import Card from "../components/common/Card"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminDashboard = () => {
  const { stats, users, analyses, reports, loading, error } = useAdmin()

  if (loading) return <Loading />

  const totalUsers = stats?.users_count || users.length
  const totalAnalyses = stats?.analyses_count || analyses.length
  const totalReports = stats?.reports_count || reports.length

  const recentAnalyses = analyses.slice(-5).reverse()
  const recentUsers = users.slice(-5).reverse()
  const recentReports = reports.slice(-5).reverse()

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

  const chartPoints = analyses.slice(-7).map((analysis, index) => {
    const probability = analysis.probability
      ? Math.round(analysis.probability * 100)
      : 0

    return {
      x: 50 + index * 80,
      y: 220 - probability * 1.7,
      probability,
      label: `Analyse ${index + 1}`,
    }
  })

  const linePath = chartPoints
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(" ")

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard administrateur</h1>
        <p className="mt-2 opacity-90">
          Vue globale sur les utilisateurs, analyses et rapports.
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
          <p className="mt-2 text-sm text-slate-500">Analyses effectuées</p>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Vue des analyses</h2>
            <span className="rounded-lg border px-3 py-1 text-sm text-slate-500">
              7 dernières analyses
            </span>
          </div>

          {chartPoints.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune analyse disponible.</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <svg viewBox="0 0 600 260" className="h-72 w-full">
                  {[0, 50, 100, 150, 200].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y + 20}
                      x2="580"
                      y2={y + 20}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {chartPoints.map((point, index) => (
                    <g key={index}>
                      <circle cx={point.x} cy={point.y} r="6" fill="#2563eb" />
                      <text x={point.x - 25} y="250" fontSize="12" fill="#64748b">
                        A{index + 1}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div
                  className="flex h-40 w-40 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e 0% ${normalPercent}%, #ef4444 ${normalPercent}% ${
                      normalPercent + pneumoniaPercent
                    }%, #e5e7eb ${
                      normalPercent + pneumoniaPercent
                    }% 100%)`,
                  }}
                >
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-bold">{analyses.length}</span>
                    <span className="text-sm text-slate-500">Total</span>
                  </div>
                </div>

                <div className="mt-4 w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Normal</span>
                    <span>
                      {normalCount} ({normalPercent}%)
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-red-600">Pneumonia</span>
                    <span>
                      {pneumoniaCount} ({pneumoniaPercent}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Analyses récentes</h2>

          {recentAnalyses.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune analyse récente.</p>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis, index) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div>
                    <p className="font-semibold">
                      Analyse récente {index + 1}
                    </p>
                    <p className="text-sm text-slate-500">
                      Utilisateur {analysis.user_id}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={
                        analysis.prediction === "PNEUMONIA"
                          ? "rounded-full bg-red-100 px-3 py-1 text-sm text-red-600"
                          : "rounded-full bg-green-100 px-3 py-1 text-sm text-green-600"
                      }
                    >
                      {analysis.prediction}
                    </span>

                    <p className="mt-2 text-sm text-slate-500">
                      {analysis.probability
                        ? `${Math.round(analysis.probability * 100)}%`
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Utilisateurs récents</h2>

          {recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun utilisateur récent.</p>
          ) : (
            recentUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b py-3"
              >
                <div>
                  <p className="font-semibold">
                    {user.full_name || `Utilisateur ${index + 1}`}
                  </p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {user.role}
                </span>
              </div>
            ))
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Rapports récents</h2>

          {recentReports.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun rapport récent.</p>
          ) : (
            recentReports.map((report, index) => (
              <div
                key={report.id}
                className="flex items-center justify-between border-b py-3"
              >
                <div>
                  <p className="font-semibold">Rapport PDF {index + 1}</p>
                  <p className="text-sm text-slate-500">
                    Analyse liée
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                  {report.status}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard