import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useAnalyses } from "../hooks/useAnalyses"
import Card from "../components/common/Card"
import Loading from "../components/common/Loading"

const Dashboard = () => {
  const { user } = useAuth()
  const { analyses, loading } = useAnalyses()

  const total = analyses.length
  const normal = analyses.filter((a) => a.prediction === "NORMAL").length
  const pneumonia = analyses.filter((a) => a.prediction === "PNEUMONIA").length
  const lastAnalysis = analyses[0]

  if (loading) return <Loading />

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm opacity-90">Bienvenue</p>
        <h1 className="text-3xl font-bold mt-1">
          Bonjour, {user?.full_name || "Utilisateur"} 👋
        </h1>
        <p className="mt-3 max-w-2xl opacity-90">
          Voici un aperçu de vos analyses médicales, vos rapports et vos résultats récents.
        </p>

        <div className="mt-6 flex gap-3">
          <Link to="/analyze" className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold">
            Nouvelle analyse
          </Link>
          <Link to="/profile" className="border border-white px-5 py-2 rounded-xl font-semibold">
            Mon profil
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="border-l-4 border-blue-600">
          <p className="text-gray-500">Total analyses</p>
          <h2 className="text-3xl font-bold mt-2">{total}</h2>
          <p className="text-sm text-gray-400 mt-1">Toutes vos radiographies analysées</p>
        </Card>

        <Card className="border-l-4 border-emerald-500">
          <p className="text-gray-500">Résultats normaux</p>
          <h2 className="text-3xl font-bold mt-2 text-emerald-600">{normal}</h2>
          <p className="text-sm text-gray-400 mt-1">Cas classés NORMAL</p>
        </Card>

        <Card className="border-l-4 border-red-500">
          <p className="text-gray-500">Pneumonie détectée</p>
          <h2 className="text-3xl font-bold mt-2 text-red-600">{pneumonia}</h2>
          <p className="text-sm text-gray-400 mt-1">Cas classés PNEUMONIA</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Dernières analyses</h2>

          {analyses.length === 0 ? (
            <p className="text-gray-500">Aucune analyse pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((a) => (
                <div key={a.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="font-semibold">{a.prediction}</p>
                    <p className="text-sm text-gray-500">
                      Probabilité : {Math.round(a.probability * 100)}%
                    </p>
                  </div>

                  <Link
                    to={`/reports`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Voir rapport
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Mon profil</h2>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-bold">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/profile"
            className="block text-center bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            Modifier mon profil
          </Link>
        </Card>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Link to="/analyze" className="bg-blue-600 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition">
          🩻 Nouvelle analyse
        </Link>

        <Link to="/history" className="bg-emerald-500 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition">
          📊 Historique
        </Link>

        <Link to="/reports" className="bg-slate-800 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition">
          📄 Rapports
        </Link>

        <Link to="/profile" className="bg-white text-blue-600 p-5 rounded-2xl text-center shadow hover:scale-105 transition">
          👤 Profil
        </Link>
      </div>
    </div>
  )
}

export default Dashboard