import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Card from "../components/common/Card"

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    admin_code: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    let newErrors = {}

    if (!form.full_name.trim()) {
      newErrors.full_name = "Nom obligatoire"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Email invalide"
    }

    if (form.password.length < 6) {
      newErrors.password = "Mot de passe min 6 caractères"
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      await registerUser(form)
      alert("Compte créé avec succès")
      navigate("/login")
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Créer un compte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              label="Nom"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Code admin optionnel"
              name="admin_code"
              type="text"
              value={form.admin_code}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-slate-500">
              Laissez vide pour créer un compte utilisateur normal.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : "Créer"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Register