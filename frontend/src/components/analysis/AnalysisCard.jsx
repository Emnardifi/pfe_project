import Button from "../common/Button"

const AnalysisCard = ({
  analysis,
  analysisNumber,
  showDetails = true,
  onDetails,
  onShowOriginalImage,
  onShowHeatmap,
  onGeneratePdf,
  onViewPdf,
  onDownloadPdf,
  onDelete,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between">
      {/* Informations analyse */}
      <div>
        <h3 className="text-lg font-bold text-slate-900">
            Analyse {analysisNumber}
        </h3>

        <p className="text-sm text-slate-600">
          <span className="font-semibold">
            Prédiction :
          </span>{" "}
          <span
            className={
              analysis.prediction === "PNEUMONIA"
                ? "font-bold text-red-600"
                : "font-bold text-green-600"
            }
          >
            {analysis.prediction}
          </span>
        </p>

        {/* Affichage optionnel détails */}
        {showDetails && (
          <>
            {analysis.probability !== null &&
            analysis.probability !== undefined ? (
              <>
                <p className="text-sm text-slate-500">
                  Risque de pneumonie :{" "}
                  {Math.round(analysis.probability * 100)}%
                </p>

                {analysis.prediction === "NORMAL" && (
                  <p className="text-sm text-slate-500">
                    Confiance NORMAL :{" "}
                    {Math.round(
                      (1 - analysis.probability) * 100
                    )}%
                  </p>
                )}

                {analysis.created_at && (
                  <p className="text-sm text-slate-500">
                    Date :{" "}
                    {new Date(
                      analysis.created_at
                    ).toLocaleString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Résultat non disponible
              </p>
            )}
          </>
        )}
      </div>

      {/* Boutons */}
      <div className="flex flex-wrap gap-2">
        {onDetails && (
          <Button
            onClick={() => onDetails(analysis)}
          >
            Détails
          </Button>
        )}

        {onShowOriginalImage && (
          <Button
            onClick={() =>
              onShowOriginalImage(analysis.id)
            }
            className="bg-slate-600 hover:bg-slate-700"
          >
            Image originale
          </Button>
        )}

        {analysis.prediction === "PNEUMONIA" &&
          onShowHeatmap && (
            <Button
              onClick={() =>
                onShowHeatmap(analysis.id)
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              Heatmap
            </Button>
          )}

        {onGeneratePdf && (
          <Button
            onClick={() =>
              onGeneratePdf(analysis.id)
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Générer PDF
          </Button>
        )}

        {onViewPdf && (
          <Button
            onClick={() =>
              onViewPdf(analysis.id)
            }
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Voir PDF
          </Button>
        )}

        {onDownloadPdf && (
          <Button
            onClick={() =>
              onDownloadPdf(analysis.id)
            }
            className="bg-slate-900 hover:bg-black"
          >
            Télécharger
          </Button>
        )}

        {onDelete && (
          <Button
            onClick={() => onDelete(analysis.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </Button>
        )}
      </div>
    </div>
  )
}

export default AnalysisCard