import { Link } from "react-router-dom"
import Card from "../common/Card"

const RecentAnalyses = ({ analyses = [] }) => {
  return (
    <Card className="lg:col-span-2">
      <h2 className="mb-4 text-xl font-bold">Dernières analyses</h2>

      {analyses.length === 0 ? (
        <p className="text-gray-500">Aucune analyse pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {analyses.slice(0, 5).map((a) => {
            const pneumoniaRisk =
              a.probability !== null && a.probability !== undefined
                ? Math.round(a.probability * 100)
                : null

            const normalConfidence =
              a.probability !== null && a.probability !== undefined
                ? Math.round((1 - a.probability) * 100)
                : null

            return (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p
                    className={
                      a.prediction === "PNEUMONIA"
                        ? "font-bold text-red-600"
                        : "font-bold text-emerald-600"
                    }
                  >
                    {a.prediction}
                  </p>

                  {pneumoniaRisk !== null ? (
                    <>
                      <p className="text-sm text-gray-500">
                        Risque de pneumonie : {pneumoniaRisk}%
                      </p>

                      {a.prediction === "NORMAL" && (
                        <p className="text-sm text-gray-500">
                          Confiance NORMAL : {normalConfidence}%
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Résultat non disponible
                    </p>
                  )}

                  {a.created_at && (
                    <p className="text-xs text-gray-400">
                      Date : {new Date(a.created_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <Link
                  to="/reports"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Voir rapport
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default RecentAnalyses