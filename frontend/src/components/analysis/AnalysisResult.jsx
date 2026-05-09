import Card from "../common/Card"

const AnalysisResult = ({ result }) => {
  if (!result) return null

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
            Probabilité :
          </span>{" "}
          {Math.round(result.probability * 100)}%
        </p>
      </div>
    </Card>
  )
}

export default AnalysisResult