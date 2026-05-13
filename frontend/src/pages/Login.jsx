// Import des hooks React pour gérer l'état
import { useState } from "react"

// Import pour la navigation entre les pages + lien vers register
import { useNavigate, Link } from "react-router-dom"

// Import du hook personnalisé pour utiliser AuthContext
import { useAuth } from "../hooks/useAuth"

// Import des composants réutilisables
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import Loading from "../components/common/Loading"

function Login() {

  // State pour stocker l'email saisi par l'utilisateur
  const [email, setEmail] = useState("")

  // State pour stocker le mot de passe
  const [password, setPassword] = useState("")

  // State pour afficher les messages d'erreur
  const [error, setError] = useState("")

  // State pour gérer le loading du formulaire
  const [loading, setLoading] = useState(false)

  // Hook pour rediriger vers une autre page
  const navigate = useNavigate()

  // Récupération de la fonction login depuis AuthContext
  const { login } = useAuth()

  // Fonction exécutée quand on soumet le formulaire
  const handleSubmit = async (e) => {

    // Empêche le rechargement de la page
    e.preventDefault()

    // Réinitialise les erreurs
    setError("")

    // Vérifie si les champs sont vides
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    try {

      // Active le loading
      setLoading(true)

      // Appel de la fonction login depuis AuthContext
      const userData = await login(email, password)

      // Si login échoue
      if (!userData) {
        setError("Email ou mot de passe incorrect")
        return
      }

      // Redirection vers dashboard
      navigate("/dashboard")

    } catch (err) {

      // Message erreur
      setError("Email ou mot de passe incorrect")

    } finally {

      // Désactive loading
      setLoading(false)
    }
  }

  return (

    // Container principal centré
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      {/* Carte contenant le formulaire */}
      <Card className="w-full max-w-xl rounded-2xl shadow-xl p-10">

        {/* Titre */}
        <h1 className="text-4xl font-bold text-center text-slate-900">
          Connexion
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-slate-600 mt-4 text-lg">
          Accédez à votre compte Smart Medical
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-10">

          {/* Champ Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="votre.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Champ Mot de passe */}
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Lien mot de passe oublié */}
          <div className="flex justify-end mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Affichage erreur */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {/* Animation loading */}
          {loading && <Loading />}

          {/* Bouton login */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

        </form>

        {/* Séparateur visuel */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-slate-500">Ou</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        {/* Lien vers Register */}
        <p className="text-center text-slate-700 text-lg">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Créer un compte
          </Link>
        </p>

      </Card>
    </div>
  )
}

// Export du composant
export default Login