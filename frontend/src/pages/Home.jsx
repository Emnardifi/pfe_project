import { Link } from "react-router-dom"
import HomeNavbar from "../components/layout/HomeNavbar"
import Footer from "../components/layout/Footer"
import homeImage from "../assets/homeimage.jpg"

const Home = () => {
  return (
    <div className="bg-white">
      <HomeNavbar />

      <section className="min-h-screen pt-28 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div>
            <span className="inline-block mb-4 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
              AI Medical Assistant
            </span>

            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Détection intelligente de la pneumonie par radiographie
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Smart Medical App aide à analyser les images X-ray, afficher le
              résultat de prédiction, générer une heatmap Grad-CAM et produire
              un rapport PDF médical.
            </p>

            <div className="flex gap-4">
              <Link
                to="/register"
                className="px-7 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg"
              >
                Commencer
              </Link>

              <Link
                to="/login"
                className="px-7 py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50"
              >
                Se connecter
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <img
               src={homeImage}
                alt="Medical AI"
                className="rounded-2xl w-full h-[420px] object-cover"
              />

              <div className="absolute -bottom-6 -left-6 bg-white shadow-xl rounded-2xl p-5">
                <p className="text-sm text-gray-500">Résultat IA</p>
                <h3 className="text-2xl font-bold text-green-600">NORMAL</h3>
                <p className="text-sm text-gray-500">Probabilité : 94%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-blue-50 shadow-sm">
              <div className="text-4xl mb-4">🩻</div>
              <h3 className="text-xl font-bold mb-2">Analyse X-ray</h3>
              <p className="text-gray-600">
                Upload d’une radiographie pulmonaire et prédiction automatique.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 shadow-sm">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">IA + Grad-CAM</h3>
              <p className="text-gray-600">
                Visualisation des zones importantes détectées par le modèle.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50 shadow-sm">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Rapport PDF</h3>
              <p className="text-gray-600">
                Génération automatique d’un rapport médical clair et structuré.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="innovation" className="py-20 bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Une solution innovante pour l’aide au diagnostic
          </h2>
          <p className="text-lg opacity-90">
            L’application combine intelligence artificielle, visualisation
            explicable et génération de rapports afin d’améliorer la rapidité,
            la lisibilité et le suivi des analyses médicales.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home