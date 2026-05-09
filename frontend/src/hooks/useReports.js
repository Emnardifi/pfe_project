import { useState } from "react"
import {
  downloadReport,
  viewReport,
  generateReport,
  deleteReport,
} from "../services/reportService"

export const useReports = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async (reportId) => {
    try {
      setLoading(true)
      setError(null)
      await downloadReport(reportId)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (reportId) => {
    try {
      setLoading(true)
      setError(null)
      await viewReport(reportId)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (analysisId) => {
    try {
      setLoading(true)
      setError(null)
      return await generateReport(analysisId)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reportId) => {
    try {
      setLoading(true)
      await deleteReport(reportId)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    handleDownload,
    handleView,
    handleGenerate,
    handleDelete,
  }
}