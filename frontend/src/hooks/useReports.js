import { useEffect, useState } from "react"

import {
  downloadReport,
  viewReport,
  generateReport,
  deleteReport,
  getMyReports,
  getReportByAnalysisId,
} from "../services/reportService"

export const useReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getMyReports()
      setReports(data)
    } catch (err) {
      setError(err)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDownload = async (reportId) => {
    try {
      setLoading(true)
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

      const response = await generateReport(analysisId)

      await fetchReports()

      return response
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

      setReports((prev) =>
        prev.filter((report) => report.id !== reportId)
      )
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleViewByAnalysis = async (analysisId) => {
    try {
      const report = await getReportByAnalysisId(analysisId)
      await handleView(report.id)
    } catch (err) {
      throw err
    }
  }

  return {
    reports,
    loading,
    error,
    fetchReports,
    handleDownload,
    handleView,
    handleGenerate,
    handleDelete,
    handleViewByAnalysis,
  }
}