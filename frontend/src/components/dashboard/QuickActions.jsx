import { Link } from "react-router-dom"
import Card from "../common/Card"

const QuickActions = () => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Actions rapides</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to="/analyze" className="bg-blue-600 text-white p-4 rounded-lg text-center">
          Nouvelle analyse
        </Link>

        <Link to="/history" className="bg-green-600 text-white p-4 rounded-lg text-center">
          Voir historique
        </Link>

        <Link to="/reports" className="bg-purple-600 text-white p-4 rounded-lg text-center">
          Rapports PDF
        </Link>

        <Link to="/profile" className="bg-gray-700 text-white p-4 rounded-lg text-center">
          Mon profil
        </Link>
      </div>
    </Card>
  )
}

export default QuickActions