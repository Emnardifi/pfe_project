import { useState, useEffect } from "react"
import {
  getMyAnalyses,
  predictImage,
  deleteAnalysis,
} from "../services/analysisService"

export const useAnalyses = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔹 charger analyses
  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const data = await getMyAnalyses()
      setAnalyses(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 prédiction
  const uploadAndPredict = async (file) => {
    try {
      setLoading(true)
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

  // 🔹 suppression
  const removeAnalysis = async (id) => {
    try {
      await deleteAnalysis(id)
      setAnalyses((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError(err)
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
  }
}