import { useState } from "react"

import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"

import AnalysisResult from "../components/analysis/AnalysisResult"
import AnalysisCard from "../components/analysis/AnalysisCard"
import ReportCard from "../components/analysis/ReportCard"

import { useAnalyses } from "../hooks/useAnalyses"
import { useReports } from "../hooks/useReports"

const History = () => {
  const {
    analyses,
    loading,
    error,
    removeAnalysis,
    getOriginalImage,
    getHeatmapImage,
  } = useAnalyses()

  const {
    reports,
    loading: reportLoading,
    handleView,
    handleDownload,
    handleDelete,
    handleViewByAnalysis,
  } = useReports()

  const [activeTab, setActiveTab] = useState("analyses")
  const [search, setSearch] = useState("")
  const [predictionFilter, setPredictionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchSearch =
      search === "" ||
      String(analysis.id).includes(search) ||
      analysis.prediction?.toLowerCase().includes(search.toLowerCase())

    const matchPrediction =
      predictionFilter === "all" || analysis.prediction === predictionFilter

    const matchDate =
      dateFilter === "" || analysis.created_at?.startsWith(dateFilter)

    return matchSearch && matchPrediction && matchDate
  })

  const filteredReports = reports.filter((report) => {
    const linkedAnalysis = analyses.find(
      (analysis) => analysis.id === report.analysis_id
    )

    const matchSearch =
      search === "" ||
      String(report.id).includes(search) ||
      String(report.analysis_id).includes(search) ||
      report.status?.toLowerCase().includes(search.toLowerCase()) ||
      linkedAnalysis?.prediction?.toLowerCase().includes(search.toLowerCase())

    const matchPrediction =
      predictionFilter === "all" || linkedAnalysis?.prediction === predictionFilter

    const matchDate =
      dateFilter === "" || report.generated_at?.startsWith(dateFilter)

    return matchSearch && matchPrediction && matchDate
  })

  const showOriginalImage = async (id) => {
    try {
      const image = await getOriginalImage(id)
      setSelectedImage(image)
    } catch {
      alert("Impossible d'afficher l'image")
    }
  }

  const showHeatmap = async (id) => {
    try {
      const image = await getHeatmapImage(id)
      setSelectedImage(image)
    } catch {
      alert("Impossible d'afficher la heatmap")
    }
  }

  const deleteAnalysis = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette analyse ?")) return

    try {
      await removeAnalysis(id)
      setSelectedItem(null)
      setSelectedImage(null)
    } catch {
      alert("Erreur suppression analyse")
    }
  }

  const deletePdf = async (reportId) => {
    if (!window.confirm("Voulez-vous supprimer ce rapport ?")) return

    try {
      await handleDelete(reportId)
    } catch {
      alert("Erreur suppression rapport")
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white">
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="mt-1 text-sm opacity-90">
          Consultez vos analyses et rapports PDF.
        </p>
      </div>

      {error && (
        <Card>
          <p className="text-sm text-red-600">
            Erreur lors du chargement de l’historique.
          </p>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3">
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

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder={
                activeTab === "analyses"
                  ? "Rechercher par id, prédiction"
                  : "Rechercher par rapport, statut"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-72"
            />

            {activeTab === "analyses" && (
              <select
                value={predictionFilter}
                onChange={(e) => setPredictionFilter(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-64"
              >
                <option value="all">Toutes les prédictions</option>
                <option value="NORMAL">Normal</option>
                <option value="PNEUMONIA">Pneumonie</option>
              </select>
            )}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-52"
            />
          </div>
        </div>
      </Card>

      {reportLoading && <Loading />}

      {activeTab === "analyses" && (
        <div className="grid gap-5">
          {filteredAnalyses.length === 0 ? (
            <Card>
              <p className="text-slate-500">Aucune analyse trouvée.</p>
            </Card>
          ) : (
            filteredAnalyses.map((analysis, index) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                analysisNumber={index + 1}
                onDetails={setSelectedItem}
                onShowOriginalImage={showOriginalImage}
                onShowHeatmap={showHeatmap}
                onViewPdf={handleViewByAnalysis}
                onDelete={deleteAnalysis}
              />
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
            filteredReports.map((report, index) => {
              const linkedAnalysis = analyses.find(
                (a) => a.id === report.analysis_id
              )

              return (
                <ReportCard
                  key={report.id}
                  report={report}
                  analysis={linkedAnalysis}
                  reportNumber={index + 1}
                  analysisNumber={index + 1}
                  handleView={handleView}
                  handleDownload={handleDownload}
                  handleDelete={deletePdf}
                />
              )
            })
          )}
        </div>
      )}

      {selectedItem && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Détails de l’analyse
            </h2>

            <Button
              onClick={() => setSelectedItem(null)}
              className="bg-slate-500 hover:bg-slate-600"
            >
              Fermer
            </Button>
          </div>

          <AnalysisResult result={selectedItem} />
        </Card>
      )}

      {selectedImage && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
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
            className="max-h-[600px] w-full rounded-xl border object-contain"
          />
        </Card>
      )}
    </div>
  )
}

export default History