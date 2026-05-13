import { useState } from "react"

import ImageUploader from "../components/analysis/ImageUploader"
import AnalysisResult from "../components/analysis/AnalysisResult"
import AnalysisCard from "../components/analysis/AnalysisCard"

import Loading from "../components/common/Loading"
import Card from "../components/common/Card"
import Button from "../components/common/Button"

import { useAnalyses } from "../hooks/useAnalyses"

const Analyze = () => {
  const {
    analyses,
    loading,
    error,
    uploadAndPredict,
    removeAnalysis,
    getOriginalImage,
    getHeatmapImage,
  } = useAnalyses()

  const [result, setResult] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleUpload = async (file) => {
    try {
      const res = await uploadAndPredict(file)
      setResult(res)
      setSelectedImage(null)
    } catch (err) {
      console.error(err)
    }
  }

  const showOriginalImage = async (id) => {
    try {
      const image = await getOriginalImage(id)
      setSelectedImage(image)
    } catch (err) {
      console.error(err)
      alert("Impossible d'afficher l'image originale")
    }
  }

  const showHeatmap = async (id) => {
    try {
      const image = await getHeatmapImage(id)
      setSelectedImage(image)
    } catch (err) {
      console.error(err)
      alert("Impossible d'afficher la heatmap")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette analyse ?"
    )

    if (!confirmDelete) return

    try {
      await removeAnalysis(id)

      if (result?.id === id || result?.analysis_id === id) {
        setResult(null)
      }

      setSelectedImage(null)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white">
        <h1 className="text-2xl font-bold">Analyse médicale</h1>
        <p className="mt-1 text-sm opacity-90">
          Importez une radiographie pour détecter la pneumonie.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Nouvelle analyse
        </h2>

        <ImageUploader onUpload={handleUpload} loading={loading} />

        {loading && <Loading />}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Une erreur est survenue pendant l’analyse.
          </p>
        )}
      </Card>

      <AnalysisResult result={result} />

      <Card>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Mes analyses récentes
        </h2>

        {analyses.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucune analyse trouvée.
          </p>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis, index) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                analysisNumber={index + 1}
                showDetails={true}
                onShowOriginalImage={showOriginalImage}
                onShowHeatmap={showHeatmap}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Card>

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

export default Analyze