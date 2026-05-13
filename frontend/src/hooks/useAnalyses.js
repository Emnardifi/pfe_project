import { useState, useEffect } from "react"

import {
  getMyAnalyses,
  predictImage,
  deleteAnalysis,
  getHeatmapBlob,
  getOriginalImageBlob,
} from "../services/analysisService"

export const useAnalyses = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getMyAnalyses()
      setAnalyses(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadAndPredict = async (file) => {
    try {
      setLoading(true)
      setError(null)

      const result = await predictImage(file)

      await fetchAnalyses()

      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeAnalysis = async (id) => {
    try {
      setError(null)

      await deleteAnalysis(id)

      setAnalyses((prev) =>
        prev.filter((analysis) => analysis.id !== id)
      )
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const getOriginalImage = async (id) => {
    const imageUrl = await getOriginalImageBlob(id)

    return {
      title: `Image originale - Analyse #${id}`,
      url: imageUrl,
    }
  }

  const getHeatmapImage = async (id) => {
    const imageUrl = await getHeatmapBlob(id)

    return {
      title: `Heatmap - Analyse #${id}`,
      url: imageUrl,
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  return {
    analyses,
    loading,
    error,
    fetchAnalyses,
    uploadAndPredict,
    removeAnalysis,
    getOriginalImage,
    getHeatmapImage,
  }
}