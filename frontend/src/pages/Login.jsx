import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import Card from "../components/common/Card"

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    let newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Email invalide"
    }

    if (form.password.length < 6) {
      newErrors.password = "Mot de passe invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    setErrors({
      ...errors,
      [e.target.name]: "",
    })

    setServerError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
    const user = await login(form.email, form.password)

    if (user) {
      // si admin -> dashboard admin
      if (user.role === "admin") {
        navigate("/admin-dashboard")
      }

      // sinon user normal
      else {
        navigate("/dashboard")
      }
    } else {
      setServerError("Email ou mot de passe incorrect")
    }
    } catch (err) {
      setServerError("Compte inexistant ou erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Connexion
        </h2>

        {serverError && (
          <div className="mb-4 bg-red-100 text-red-700 p-2 rounded text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showPassword ? "Cacher" : "Afficher"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Login