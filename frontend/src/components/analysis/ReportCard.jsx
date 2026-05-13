import Card from "../common/Card"
import Button from "../common/Button"
import { getReportByAnalysisId } from "../../services/reportService"

const ReportCard = ({
  analysis,
  reportNumber,
  analysisNumber,
  reportLoading,
  handleGenerate,
  handleView,
  handleDownload,
  handleDelete,
}) => {
  const getErrorMessage = (err) => {
    return (
      err.response?.data?.detail ||
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      "Une erreur est survenue"
    )
  }

  const handleGenerateReport = async () => {
    try {
      await handleGenerate(analysis.id)
      alert("Rapport généré avec succès")
    } catch (err) {
      console.error("Erreur génération rapport :", err)
      alert(getErrorMessage(err))
    }
  }

  const handleViewReport = async () => {
    try {
      const report = await getReportByAnalysisId(
        analysis.id
      )

      if (!report?.id) {
        alert(
          "Aucun rapport trouvé. Générez d’abord le rapport."
        )
        return
      }

      await handleView(report.id)
    } catch (err) {
      console.error("Erreur voir rapport :", err)
      alert(
        "Aucun rapport trouvé. Générez d’abord le rapport."
      )
    }
  }

  const handleDownloadReport = async () => {
    try {
      const report = await getReportByAnalysisId(
        analysis.id
      )

      if (!report?.id) {
        alert(
          "Aucun rapport trouvé. Générez d’abord le rapport."
        )
        return
      }

      await handleDownload(report.id)
    } catch (err) {
      console.error(
        "Erreur téléchargement rapport :",
        err
      )
      alert(
        "Aucun rapport trouvé. Générez d’abord le rapport."
      )
    }
  }

  const handleDeleteReport = async () => {
    try {
      const report = await getReportByAnalysisId(
        analysis.id
      )

      if (!report?.id) {
        alert("Aucun rapport trouvé")
        return
      }

      const confirmDelete = window.confirm(
        "Voulez-vous supprimer ce rapport ?"
      )

      if (!confirmDelete) return

      await handleDelete(report.id)

      alert("Rapport supprimé avec succès")
    } catch (err) {
      console.error(err)
      alert("Erreur suppression rapport")
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Partie gauche */}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900">
            Rapport {reportNumber} - Analyse {analysisNumber}
          </h3>

          <p className="text-base text-slate-700">
            Prédiction :{" "}
            <span
              className={
                analysis.prediction === "PNEUMONIA"
                  ? "font-bold text-red-600"
                  : "font-bold text-green-600"
              }
            >
              {analysis.prediction ||
                "Non disponible"}
            </span>
          </p>

          <p className="text-sm text-slate-600">
            Risque de pneumonie :{" "}
            {analysis.probability !== null &&
            analysis.probability !== undefined
              ? `${Math.round(
                  analysis.probability * 100
                )}%`
              : "Non disponible"}
          </p>

          {analysis.prediction === "NORMAL" && (
            <p className="text-sm text-slate-600">
              Confiance NORMAL :{" "}
              {analysis.probability !== null &&
              analysis.probability !== undefined
                ? `${Math.round(
                    (1 - analysis.probability) * 100
                  )}%`
                : "Non disponible"}
            </p>
          )}

          <p className="text-sm text-slate-500">
            Date :{" "}
            {analysis.created_at
              ? new Date(
                  analysis.created_at
                ).toLocaleString()
              : "Non disponible"}
          </p>
        </div>

        {/* Partie droite */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            disabled={reportLoading}
            onClick={handleGenerateReport}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Générer rapport
          </Button>

          <Button
            disabled={reportLoading}
            onClick={handleViewReport}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            Voir PDF
          </Button>

          <Button
            disabled={reportLoading}
            onClick={handleDownloadReport}
            className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-900 disabled:opacity-50"
          >
            Télécharger
          </Button>

          <Button
            disabled={reportLoading}
            onClick={handleDeleteReport}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            Supprimer PDF
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ReportCard