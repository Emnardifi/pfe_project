import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        
        {/* 🔹 Logo + description */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center font-bold">
              SM
            </div>
            <h3 className="text-xl font-bold">Smart Medical</h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Plateforme intelligente pour analyser les radiographies pulmonaires,
            détecter la pneumonie et générer des rapports médicaux automatiquement.
          </p>
        </div>

        {/* 🔹 Navigation */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/analyze" className="hover:text-white">Analyse</Link></li>
            <li><Link to="/history" className="hover:text-white">Historique</Link></li>
            <li><Link to="/reports" className="hover:text-white">Rapports</Link></li>
          </ul>
        </div>

        {/* 🔹 Services */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Services</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>🩻 Analyse X-ray</li>
            <li>🧠 IA & Grad-CAM</li>
            <li>📄 Rapports PDF</li>
            <li>📊 Historique médical</li>
          </ul>
        </div>

        {/* 🔹 Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📧 support@smartmedical.com</li>
            <li>📍 Tunisie</li>
            <li>🎓 Projet PFE</li>
          </ul>

          {/* Social */}
          <div className="flex gap-3 mt-4">
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-blue-600 cursor-pointer">🌐</div>
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-blue-500 cursor-pointer">🐦</div>
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-emerald-500 cursor-pointer">💼</div>
          </div>
        </div>
      </div>

      {/* 🔻 bottom */}
      <div className="border-t border-slate-700 text-center py-5 text-gray-400 text-sm">
        © 2026 Smart Medical App — Tous droits réservés
      </div>
    </footer>
  )
}

export default Footer