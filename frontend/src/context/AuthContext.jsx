import { createContext, useState, useEffect } from "react"
import { loginUser, getCurrentUser, logoutUser } from "../services/authService"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  // 🔹 Charger user si token existe
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (token) {
          const data = await getCurrentUser()
          setUser(data)
        }
      } catch (error) {
        console.log("Erreur chargement user", error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // 🔹 LOGIN
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password)

      const accessToken = data.access_token

      localStorage.setItem("token", accessToken)
      setToken(accessToken)

      const userData = await getCurrentUser()
      setUser(userData)

      return userData
    } catch (error) {
      console.log("Erreur login", error)
      return null
    }
  }

  // 🔹 LOGOUT
  const logout = () => {
    logoutUser()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}