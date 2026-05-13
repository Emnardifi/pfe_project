import Card from "../common/Card"

const AnalysisResult = ({ result }) => {
  if (!result) return null

  const pneumoniaRisk = Math.round(result.probability * 100)
  const normalConfidence = Math.round(
    (1 - result.probability) * 100
  )

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold text-slate-800">
        Résultat
      </h2>
      <div className="space-y-3">
        <p className="text-lg">
          <span className="font-semibold">
            Prédiction :
          </span>{" "}
          <span
            className={
              result.prediction === "PNEUMONIA"
                ? "font-bold text-red-600"
                : "font-bold text-green-600"
            }
          >
            {result.prediction}
          </span>
        </p>

        <p className="text-lg">
          <span className="font-semibold">
            Risque de pneumonie :
          </span>{" "}
          {pneumoniaRisk}%
        </p>

        {result.prediction === "NORMAL" && (
          <p className="text-lg">
            <span className="font-semibold">
              Confiance NORMAL :
            </span>{" "}
            {normalConfidence}%
          </p>
        )}

        {/* Date création */}
        {result.created_at && (
          <p className="text-sm text-slate-500">
            <span className="font-semibold">
              Date de création :
            </span>{" "}
            {new Date(result.created_at).toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  )
}

export default AnalysisResult