import { useEffect, useState } from "react"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"
import { useAnalyses } from "../hooks/useAnalyses"
import { useReports } from "../hooks/useReports"
import {
  getHeatmapBlob,
  getOriginalImageBlob,
} from "../services/analysisService"
import {
  getMyReports,
  getReportByAnalysisId,
} from "../services/reportService"

const History = () => {
  const { analyses, loading, error, removeAnalysis } = useAnalyses()

  const {
    loading: reportLoading,
    handleGenerate,
    handleView,
    handleDownload,
    handleDelete,
  } = useReports()

  const [reports, setReports] = useState([])
  const [activeTab, setActiveTab] = useState("analyses")
  const [search, setSearch] = useState("")
  const [predictionFilter, setPredictionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchReports = async () => {
    try {
      const data = await getMyReports()
      setReports(data)
    } catch (err) {
      console.error("Erreur chargement rapports :", err)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchSearch =
      search === "" ||
      String(analysis.id).includes(search) ||
      analysis.prediction?.toLowerCase().includes(search.toLowerCase())

    const matchPrediction =
      predictionFilter === "all" ||
      analysis.prediction === predictionFilter

    const matchDate =
      dateFilter === "" ||
      analysis.created_at?.startsWith(dateFilter)

    return matchSearch && matchPrediction && matchDate
  })

  const filteredReports = reports.filter((report) => {
    const matchSearch =
      search === "" ||
      String(report.id).includes(search) ||
      String(report.analysis_id).includes(search) ||
      report.status?.toLowerCase().includes(search.toLowerCase())

    const matchDate =
      dateFilter === "" ||
      report.generated_at?.startsWith(dateFilter)

    return matchSearch && matchDate
  })

  const showOriginalImage = async (id) => {
    try {
      const imageUrl = await getOriginalImageBlob(id)
      setSelectedImage({
        title: `Image originale - Analyse #${id}`,
        url: imageUrl,
      })
    } catch (err) {
      console.error(err)
      alert("Impossible d'afficher l'image originale")
    }
  }

  const showHeatmap = async (id) => {
    try {
      const imageUrl = await getHeatmapBlob(id)
      setSelectedImage({
        title: `Heatmap - Analyse #${id}`,
        url: imageUrl,
      })
    } catch (err) {
      console.error(err)
      alert("Impossible d'afficher la heatmap")
    }
  }

  const generatePdf = async (analysisId) => {
    try {
      await handleGenerate(analysisId)
      await fetchReports()
      alert("Rapport généré avec succès")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.detail || "Erreur génération rapport")
    }
  }

  const viewPdfByAnalysis = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)
      await handleView(report.id)
    } catch (err) {
      alert("Aucun rapport trouvé. Générez d’abord le rapport.")
    }
  }

  const downloadPdfByAnalysis = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)
      await handleDownload(report.id)
    } catch (err) {
      alert("Aucun rapport trouvé. Générez d’abord le rapport.")
    }
  }

  const deletePdf = async (reportId) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer ce rapport ?")
    if (!confirmDelete) return

    try {
      await handleDelete(reportId)
      await fetchReports()
      alert("Rapport supprimé avec succès")
    } catch (err) {
      console.error(err)
      alert("Erreur suppression rapport")
    }
  }

  const deleteAnalysis = async (id) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer cette analyse ?")
    if (!confirmDelete) return

    await removeAnalysis(id)
    setSelectedItem(null)
    setSelectedImage(null)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white">
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="mt-1 text-sm opacity-90">
          Consultez vos analyses, rapports PDF, images et heatmaps.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          Erreur lors du chargement de l’historique.
        </p>
      )}

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab("analyses")}
              className={
                activeTab === "analyses"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-500 hover:bg-slate-600"
              }
            >
              Analyses
            </Button>

            <Button
              onClick={() => setActiveTab("reports")}
              className={
                activeTab === "reports"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-500 hover:bg-slate-600"
              }
            >
              Rapports
            </Button>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              type="text"
              placeholder="Rechercher par id, prédiction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm"
            />

            {activeTab === "analyses" && (
              <select
                value={predictionFilter}
                onChange={(e) => setPredictionFilter(e.target.value)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                <option value="all">Toutes les prédictions</option>
                <option value="PNEUMONIA">PNEUMONIA</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            )}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      {reportLoading && (
        <Card>
          <Loading />
          <p className="mt-2 text-sm text-slate-500">Traitement en cours...</p>
        </Card>
      )}

      {activeTab === "analyses" && (
        <div className="grid gap-5">
          {filteredAnalyses.length === 0 ? (
            <Card>
              <p className="text-slate-500">Aucune analyse trouvée.</p>
            </Card>
          ) : (
            filteredAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Analyse #{analysis.id}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      Prédiction :{" "}
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

                    <p className="text-sm text-slate-600">
                      Probabilité :{" "}
                      {analysis.probability !== null &&
                      analysis.probability !== undefined
                        ? `${Math.round(analysis.probability * 100)}%`
                        : "Non disponible"}
                    </p>

                    {analysis.created_at && (
                      <p className="text-sm text-slate-500">
                        Date : {new Date(analysis.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setSelectedItem(analysis)}
                      className="bg-slate-700 hover:bg-slate-800"
                    >
                      Détails
                    </Button>

                    <Button
                      onClick={() => showOriginalImage(analysis.id)}
                      className="bg-slate-600 hover:bg-slate-700"
                    >
                      Image
                    </Button>

                    <Button
                      onClick={() => showHeatmap(analysis.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Heatmap
                    </Button>

                    <Button
                      onClick={() => generatePdf(analysis.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Générer PDF
                    </Button>

                    <Button
                      onClick={() => viewPdfByAnalysis(analysis.id)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Voir PDF
                    </Button>

                    <Button
                      onClick={() => downloadPdfByAnalysis(analysis.id)}
                      className="bg-slate-900 hover:bg-black"
                    >
                      Télécharger
                    </Button>

                    <Button
                      onClick={() => deleteAnalysis(analysis.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "reports" && (
        <div className="grid gap-5">
          {filteredReports.length === 0 ? (
            <Card>
              <p className="text-slate-500">Aucun rapport trouvé.</p>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Rapport #{report.id}
                    </h2>

                    <p className="text-sm text-slate-600">
                      Analyse liée : #{report.analysis_id}
                    </p>

                    <p className="text-sm text-slate-600">
                      Statut : {report.status}
                    </p>

                    <p className="text-sm text-slate-500">
                      Date :{" "}
                      {report.generated_at
                        ? new Date(report.generated_at).toLocaleString()
                        : "Non disponible"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleView(report.id)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Voir PDF
                    </Button>

                    <Button
                      onClick={() => handleDownload(report.id)}
                      className="bg-slate-900 hover:bg-black"
                    >
                      Télécharger
                    </Button>

                    <Button
                      onClick={() => deletePdf(report.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedItem && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Détails analyse #{selectedItem.id}
            </h2>

            <Button
              onClick={() => setSelectedItem(null)}
              className="bg-slate-500 hover:bg-slate-600"
            >
              Fermer
            </Button>
          </div>

          <div className="grid gap-2 text-sm text-slate-700">
            <p>ID : {selectedItem.id}</p>
            <p>Prédiction : {selectedItem.prediction}</p>
            <p>
              Probabilité :{" "}
              {selectedItem.probability !== null &&
              selectedItem.probability !== undefined
                ? `${Math.round(selectedItem.probability * 100)}%`
                : "Non disponible"}
            </p>
            <p>Statut : {selectedItem.status || "Non disponible"}</p>
            <p>
              Date :{" "}
              {selectedItem.created_at
                ? new Date(selectedItem.created_at).toLocaleString()
                : "Non disponible"}
            </p>
          </div>
        </Card>
      )}

      {selectedImage && (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              {selectedImage.title}
            </h2>

            <Button
              onClick={() => setSelectedImage(null)}
              className="bg-slate-500 hover:bg-slate-600"
            >
              Fermer
            </Button>
          </div>

          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            className="max-h-[600px] w-full rounded-xl border object-contain shadow-sm"
          />
        </Card>
      )}
    </div>
  )
}

export default History