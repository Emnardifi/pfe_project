import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useAnalyses } from "../hooks/useAnalyses"

import Card from "../components/common/Card"
import Loading from "../components/common/Loading"

import StatCard from "../components/dashboard/StatCard"
import RecentAnalyses from "../components/dashboard/RecentAnalyses"
import QuickActions from "../components/dashboard/QuickActions"

const Dashboard = () => {
  const { user } = useAuth()
  const { analyses, loading } = useAnalyses()

  const total = analyses.length
  const normal = analyses.filter((a) => a.prediction === "NORMAL").length
  const pneumonia = analyses.filter((a) => a.prediction === "PNEUMONIA").length

  if (loading) return <Loading />

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <p className="text-sm opacity-90">Bienvenue</p>

        <h1 className="mt-1 text-3xl font-bold">
          Bonjour, {user?.full_name || "Utilisateur"} 👋
        </h1>

        <p className="mt-3 max-w-2xl opacity-90">
          Voici un aperçu de vos analyses médicales, vos rapports et vos résultats récents.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/analyze"
            className="rounded-xl bg-white px-5 py-2 font-semibold text-blue-600"
          >
            Nouvelle analyse
          </Link>

          <Link
            to="/profile"
            className="rounded-xl border border-white px-5 py-2 font-semibold"
          >
            Mon profil
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          title="Total analyses"
          value={total}
          description="Toutes vos radiographies analysées"
          color="blue"
        />

        <StatCard
          title="Résultats normaux"
          value={normal}
          description="Cas classés NORMAL"
          color="green"
        />

        <StatCard
          title="Pneumonie détectée"
          value={pneumonia}
          description="Cas classés PNEUMONIA"
          color="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentAnalyses analyses={analyses} />

        <Card>
          <h2 className="mb-4 text-xl font-bold">Mon profil</h2>

          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="font-bold">{user?.full_name || "Utilisateur"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/profile"
            className="block rounded-xl bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
          >
            Modifier mon profil
          </Link>
        </Card>
      </div>

      <QuickActions />
    </div>
  )
}

export default Dashboard