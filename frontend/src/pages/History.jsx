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
      analysis.prediction
        ?.toLowerCase()
        .includes(search.toLowerCase())

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
      report.status
        ?.toLowerCase()
        .includes(search.toLowerCase())

    const matchDate =
      dateFilter === "" ||
      report.generated_at?.startsWith(dateFilter)

    return matchSearch && matchDate
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
    const confirmDelete = window.confirm(
      "Voulez-vous supprimer cette analyse ?"
    )

    if (!confirmDelete) return

    try {
      await removeAnalysis(id)
      setSelectedItem(null)
      setSelectedImage(null)
    } catch {
      alert("Erreur suppression analyse")
    }
  }

  const deletePdf = async (reportId) => {
    const confirmDelete = window.confirm(
      "Voulez-vous supprimer ce rapport ?"
    )

    if (!confirmDelete) return

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
        <h1 className="text-2xl font-bold">
          Historique
        </h1>

        <p className="mt-1 text-sm opacity-90">
          Consultez vos analyses et rapports PDF.
        </p>
      </div>

      <Card>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("analyses")}
          >
            Analyses
          </Button>

          <Button
            onClick={() => setActiveTab("reports")}
          >
            Rapports
          </Button>
        </div>
      </Card>

      {reportLoading && <Loading />}

      {activeTab === "analyses" && (
        <div className="grid gap-5">
          {filteredAnalyses.map((analysis, index) => (
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
          ))}
        </div>
      )}

      {activeTab === "reports" && (
        <div className="grid gap-5">
          {filteredReports.map((report, index) => {
            const linkedAnalysis =
              analyses.find(
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
          })}
        </div>
      )}

      {selectedItem && (
        <Card>
          <AnalysisResult result={selectedItem} />
        </Card>
      )}

      {selectedImage && (
        <Card>
          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            className="rounded-xl"
          />
        </Card>
      )}
    </div>
  )
}

export default History