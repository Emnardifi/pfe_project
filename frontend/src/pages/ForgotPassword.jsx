import { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../services/authService"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Button from "../components/common/Button"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [resetLink, setResetLink] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setResetLink("")
    setError("")
    setLoading(true)

    try {
      const data = await forgotPassword(email)

      setMessage(data.message || "Lien de réinitialisation généré.")
      setResetLink(data.reset_link || "")
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de la demande.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Mot de passe oublié
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            <p>{message}</p>

            {resetLink && (
              <a
                href={resetLink}
                className="block mt-2 text-blue-600 underline break-all"
              >
                Cliquer ici pour réinitialiser
              </a>
            )}
          </div>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default ForgotPassword