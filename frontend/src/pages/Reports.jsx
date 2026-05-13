import { useAnalyses } from "../hooks/useAnalyses"
import { useReports } from "../hooks/useReports"

import Card from "../components/common/Card"
import Loading from "../components/common/Loading"
import ReportCard from "../components/analysis/ReportCard"

const Reports = () => {
  const { analyses, loading, error } = useAnalyses()

  const {
    loading: reportLoading,
    handleDownload,
    handleView,
    handleGenerate,
    handleDelete,
  } = useReports()

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
        <div className="space-y-4">
          {analyses.map((analysis, index) => (
            <ReportCard
              key={analysis.id}
              analysis={analysis}
              reportNumber={index + 1}
              analysisNumber={index + 1}
              reportLoading={reportLoading}
              handleGenerate={handleGenerate}
              handleView={handleView}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports