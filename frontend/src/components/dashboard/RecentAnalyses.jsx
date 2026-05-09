import Card from "../common/Card"
import { formatDate } from "../../utils/formatDate"

const RecentAnalyses = ({ analyses = [] }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Analyses récentes</h3>

      {analyses.length === 0 ? (
        <p className="text-gray-500">Aucune analyse trouvée.</p>
      ) : (
        <div className="space-y-3">
          {analyses.slice(0, 5).map((analysis) => (
            <div key={analysis.id} className="border-b pb-2">
              <p className="font-medium">{analysis.prediction}</p>
              <p className="text-sm text-gray-500">
                Probabilité : {analysis.probability}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(analysis.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default RecentAnalyses