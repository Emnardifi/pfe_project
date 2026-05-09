import { useAnalyses } from "../hooks/useAnalyses"
import { useReports } from "../hooks/useReports"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"
import { getReportByAnalysisId } from "../services/reportService"

const Reports = () => {
  const { analyses, loading, error } = useAnalyses()

  const {
    loading: reportLoading,
    handleDownload,
    handleView,
    handleGenerate,
    handleDelete,
  } = useReports()

  const getErrorMessage = (err) => {
    return (
      err.response?.data?.detail ||
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      "Une erreur est survenue"
    )
  }

  const handleGenerateReport = async (analysisId) => {
    try {
      await handleGenerate(analysisId)
      alert("Rapport généré avec succès")
    } catch (err) {
      console.error("Erreur génération rapport :", err)
      console.error("Erreur backend :", err.response?.data)
      alert(getErrorMessage(err))
    }
  }

  const handleViewReport = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)

      if (!report?.id) {
        alert("Aucun rapport trouvé. Générez d’abord le rapport.")
        return
      }

      await handleView(report.id)
    } catch (err) {
      console.error("Erreur voir rapport :", err)
      alert("Aucun rapport trouvé. Générez d’abord le rapport.")
    }
  }

  const handleDownloadReport = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)

      if (!report?.id) {
        alert("Aucun rapport trouvé. Générez d’abord le rapport.")
        return
      }

      await handleDownload(report.id)
    } catch (err) {
      console.error("Erreur téléchargement rapport :", err)
      alert("Aucun rapport trouvé. Générez d’abord le rapport.")
    }
  }

  const handleDeleteReport = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)

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

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Rapports PDF</h1>
        <p className="mt-2 opacity-90">
          Générez, consultez et téléchargez les rapports de vos analyses.
        </p>
      </div>

      {error && (
        <Card>
          <p className="text-sm text-red-600">
            Erreur lors du chargement des analyses.
          </p>
        </Card>
      )}

      {reportLoading && (
        <Card>
          <Loading />
          <p className="mt-2 text-sm text-slate-500">
            Traitement du rapport en cours...
          </p>
        </Card>
      )}

      {analyses.length === 0 ? (
        <Card>
          <p className="text-slate-500">
            Aucune analyse trouvée. Lancez d’abord une analyse.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Analyse #{analysis.id}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Prédiction :{" "}
                    <span
                      className={
                        analysis.prediction === "PNEUMONIA"
                          ? "font-bold text-red-600"
                          : "font-bold text-emerald-600"
                      }
                    >
                      {analysis.prediction || "Non disponible"}
                    </span>
                  </p>

                  <p className="text-sm text-slate-500">
                    Probabilité :{" "}
                    {analysis.probability !== null &&
                    analysis.probability !== undefined
                      ? `${Math.round(analysis.probability * 100)}%`
                      : "Non disponible"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={reportLoading}
                    onClick={() => handleGenerateReport(analysis.id)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Générer rapport
                  </Button>

                  <Button
                    disabled={reportLoading}
                    onClick={() => handleViewReport(analysis.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Voir PDF
                  </Button>

                  <Button
                    disabled={reportLoading}
                    onClick={() => handleDownloadReport(analysis.id)}
                    className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50"
                  >
                    Télécharger
                  </Button>

                  <Button
                    disabled={reportLoading}
                    onClick={() => handleDeleteReport(analysis.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports