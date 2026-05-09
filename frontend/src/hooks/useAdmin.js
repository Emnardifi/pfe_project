import { useEffect, useState } from "react"
import {
  getAllUsers,
  getAllAnalyses,
  getAllReports,
  getAdminStats,
  adminDeleteUser,
  adminDeleteAnalysis,
  adminDeleteReport,
} from "../services/adminService"

export const useAdmin = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError("")

      const statsData = await getAdminStats()
      const usersData = await getAllUsers()
      const analysesData = await getAllAnalyses()
      const reportsData = await getAllReports()

      setStats(statsData)
      setUsers(usersData)
      setAnalyses(analysesData)
      setReports(reportsData)
    } catch (err) {
      console.error("Erreur admin :", err.response?.data || err)
      setError("Erreur lors du chargement des données admin.")
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    await adminDeleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const deleteAnalysis = async (id) => {
    await adminDeleteAnalysis(id)
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
  }

  const deleteReport = async (id) => {
    await adminDeleteReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  return {
    stats,
    users,
    analyses,
    reports,
    loading,
    error,
    fetchAdminData,
    deleteUser,
    deleteAnalysis,
    deleteReport,
  }
}