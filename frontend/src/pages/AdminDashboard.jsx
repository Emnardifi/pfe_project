import Card from "../components/common/Card"
import Loading from "../components/common/Loading"
import { useAdmin } from "../hooks/useAdmin"

const AdminDashboard = () => {
  const { stats, users, analyses, reports, loading, error } = useAdmin()

  if (loading) return <Loading />

  const recentAnalyses = analyses.slice(-5).reverse()
  const recentUsers = users.slice(-5).reverse()
  const recentReports = reports.slice(-5).reverse()

  const pneumoniaCount = analyses.filter(
    (a) => a.prediction === "PNEUMONIA"
  ).length

  const normalCount = analyses.filter(
    (a) => a.prediction === "NORMAL"
  ).length

  const totalAnalyses = analyses.length || 1

  const pneumoniaPercent = Math.round((pneumoniaCount / totalAnalyses) * 100)
  const normalPercent = Math.round((normalCount / totalAnalyses) * 100)

  const chartPoints = analyses.slice(-7).map((analysis, index) => {
    const probability = analysis.probability
      ? Math.round(analysis.probability * 100)
      : 0

    const x = 50 + index * 80
    const y = 220 - probability * 1.7

    return { x, y, probability, id: analysis.id }
  })

  const linePath = chartPoints
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(" ")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Bienvenue dans l’espace administrateur.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.users_count || 0}
          </h2>
          <p className="mt-2 text-sm text-emerald-600">↑ dynamique</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Total Analyses</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {stats?.analyses_count || 0}
          </h2>
          <p className="mt-2 text-sm text-emerald-600">↑ dynamique</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Reports Generated</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {stats?.reports_count || 0}
          </h2>
          <p className="mt-2 text-sm text-emerald-600">↑ dynamique</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Model Accuracy</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-600">95%</h2>
          <p className="mt-2 text-sm text-emerald-600">AI model</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Analyses Overview</h2>
            <span className="rounded-lg border px-3 py-1 text-sm text-slate-500">
              Last 7 analyses
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

                  {chartPoints.map((point) => (
                    <g key={point.id}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="#2563eb"
                      />
                      <text
                        x={point.x - 12}
                        y="250"
                        fontSize="13"
                        fill="#64748b"
                      >
                        #{point.id}
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
                    <span className="text-2xl font-bold">
                      {analyses.length}
                    </span>
                    <span className="text-sm text-slate-500">Total</span>
                  </div>
                </div>

                <div className="mt-4 w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Normal</span>
                    <span>{normalCount} ({normalPercent}%)</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-red-600">Pneumonia</span>
                    <span>{pneumoniaCount} ({pneumoniaPercent}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Recent Analyses</h2>

          {recentAnalyses.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune analyse récente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-3">ID</th>
                    <th>User</th>
                    <th>Result</th>
                    <th>Confidence</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="border-b">
                      <td className="py-3">#{analysis.id}</td>
                      <td>User #{analysis.user_id}</td>
                      <td>
                        <span
                          className={
                            analysis.prediction === "PNEUMONIA"
                              ? "rounded-full bg-red-100 px-3 py-1 text-red-600"
                              : "rounded-full bg-green-100 px-3 py-1 text-green-600"
                          }
                        >
                          {analysis.prediction}
                        </span>
                      </td>
                      <td>
                        {analysis.probability
                          ? `${Math.round(analysis.probability * 100)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Users</h2>

          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {user.role}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Recent Reports</h2>

          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                <p className="font-semibold">Report #{report.id}</p>
                <p className="text-sm text-slate-500">
                  Analyse #{report.analysis_id}
                </p>
              </div>

              <span className="text-sm text-slate-500">{report.status}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Model Performance</h2>

          <div className="flex items-center justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-emerald-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">95%</p>
                <p className="text-sm text-slate-500">Accuracy</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Precision</span>
              <span>96%</span>
            </div>
            <div className="flex justify-between">
              <span>Recall</span>
              <span>95%</span>
            </div>
            <div className="flex justify-between">
              <span>F1 Score</span>
              <span>95%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard