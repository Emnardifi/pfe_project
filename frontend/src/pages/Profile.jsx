import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { updateMyProfile, changePassword } from "../services/userService"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Button from "../components/common/Button"

const Profile = () => {
  const { user } = useAuth()

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  })

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    try {
      await updateMyProfile(profileForm)
      setMessage("Profil modifié avec succès.")
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur modification profil.")
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      })

      setMessage("Mot de passe modifié avec succès.")
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Erreur modification mot de passe."
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-lg">
        <p className="text-sm opacity-90">Mon espace</p>
        <h1 className="mt-1 text-3xl font-bold">Profil utilisateur</h1>
        <p className="mt-2 opacity-90">
          Gérez vos informations personnelles et votre mot de passe.
        </p>
      </div>

      {message && (
        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {user?.full_name}
            </h2>

            <p className="text-sm text-slate-500">{user?.email}</p>

            <div className="mt-5 w-full rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm text-slate-500">Rôle</p>
              <p className="font-semibold text-slate-800">
                {user?.role || "user"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Modifier les informations personnelles
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Nom complet"
              name="full_name"
              value={profileForm.full_name}
              onChange={handleProfileChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
            />

            <Button type="submit" className="w-full sm:w-auto">
              Enregistrer les modifications
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Modifier le mot de passe
        </h2>

        <form onSubmit={handleUpdatePassword} className="grid gap-4 md:grid-cols-3">
          <Input
            label="Ancien mot de passe"
            name="old_password"
            type="password"
            value={passwordForm.old_password}
            onChange={handlePasswordChange}
          />

          <Input
            label="Nouveau mot de passe"
            name="new_password"
            type="password"
            value={passwordForm.new_password}
            onChange={handlePasswordChange}
          />

          <Input
            label="Confirmer le nouveau mot de passe"
            name="confirm_password"
            type="password"
            value={passwordForm.confirm_password}
            onChange={handlePasswordChange}
          />

          <div className="md:col-span-3">
            <Button type="submit">
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Profile