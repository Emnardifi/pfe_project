import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { registerUser } from "../services/authService"

import Input from "../components/common/Input"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import Loading from "../components/common/Loading"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [adminCode, setAdminCode] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    try {
      setLoading(true)

      await registerUser({
        full_name: name,
        email: email,
        password: password,
        admin_code: adminCode,
      })

      setSuccess(
        "Compte créé avec succès. Redirection vers la connexion..."
      )

      setTimeout(() => {
        navigate("/login")
      }, 1200)

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Erreur lors de la création du compte"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <Card className="w-full max-w-lg rounded-2xl p-7 shadow-xl">
        {/* Titre */}
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Créer un compte
        </h1>

        {/* Sous titre */}
        <p className="mt-2 text-center text-base text-slate-600">
          Rejoignez Smart Medical aujourd'hui
        </p>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-1"
        >
          <Input
            label="Nom"
            name="name"
            type="text"
            placeholder="Votre nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="votre.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <Input
            label="Code administrateur (optionnel)"
            name="adminCode"
            type="text"
            placeholder="Laissez vide pour un compte utilisateur"
            value={adminCode}
            onChange={(e) =>
              setAdminCode(e.target.value)
            }
          />

          <p className="mb-4 text-sm text-slate-500">
            Laissez vide pour créer un compte utilisateur standard.
          </p>

          {/* Message erreur */}
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Message succès */}
          {success && (
            <p className="mb-3 rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
              {success}
            </p>
          )}

          {loading && <Loading />}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 font-semibold"
          >
            {loading
              ? "Inscription..."
              : "S'inscrire"}
          </Button>
        </form>

        {/* Séparateur */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-300"></div>
          <span className="text-slate-500">
            Ou
          </span>
          <div className="h-px flex-1 bg-slate-300"></div>
        </div>

        {/* Login */}
        <p className="text-center text-base text-slate-700">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Register