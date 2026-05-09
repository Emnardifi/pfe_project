import api from "./api"

export const generateReport = async (analysisId) => {
  const response = await api.post(
    `/reports/analysis/${analysisId}/generate-if-missing`
  )
  return response.data
}

export const getMyReports = async () => {
  const response = await api.get("/reports/history-report")
  return response.data
}

export const getReportById = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`)
  return response.data
}

export const getReportByAnalysisId = async (analysisId) => {
  const response = await api.get(`/reports/analysis/${analysisId}`)
  return response.data
}

export const downloadReport = async (reportId) => {
  const response = await api.get(`/reports/${reportId}/download`, {
    responseType: "blob",
  })

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  )

  const link = document.createElement("a")
  link.href = url
  link.download = `report_${reportId}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.URL.revokeObjectURL(url)
}

export const viewReport = async (reportId) => {
  const response = await api.get(`/reports/${reportId}/view`, {
    responseType: "blob",
  })

  const fileURL = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  )

  window.open(fileURL, "_blank")
}

export const deleteReport = async (reportId) => {
  const response = await api.delete(`/reports/${reportId}`)
  return response.data
}