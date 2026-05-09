import api from "./api"

// Users
export const getAllUsers = async () => {
  const response = await api.get("/admin/users")
  return response.data
}

export const adminGetUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`)
  return response.data
}

export const adminUpdateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData)
  return response.data
}

export const adminDeleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`)
  return response.data
}

// Analyses
export const getAllAnalyses = async () => {
  const response = await api.get("/admin/analyses")
  return response.data
}

export const adminDeleteAnalysis = async (analysisId) => {
  const response = await api.delete(`/admin/analyses/${analysisId}`)
  return response.data
}

// Reports
export const getAllReports = async () => {
  const response = await api.get("/admin/reports")
  return response.data
}

export const adminDeleteReport = async (reportId) => {
  const response = await api.delete(`/admin/reports/${reportId}`)
  return response.data
}

// Dashboard / Stats
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats")
  return response.data
}

export const adminGetDashboard = async () => {
  const response = await api.get("/admin/dashboard")
  return response.data
}