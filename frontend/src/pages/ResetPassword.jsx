import { useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { resetPassword } from "../services/authService"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    try {
      await resetPassword(token, newPassword)
      setMessage("Mot de passe modifié avec succès.")
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur réinitialisation.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Réinitialiser le mot de passe
        </h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border p-2 rounded mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Réinitialiser
          </button>
        </form>

        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-600">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword