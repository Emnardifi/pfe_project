import Card from "../common/Card"
import Button from "../common/Button"
import { useReports } from "../../hooks/useReports"

const ReportCard = ({ report }) => {
  const { handleDownload, handleView, loading } = useReports()

  return (
    <Card>
      <h3 className="font-bold text-lg mb-2">Rapport #{report.id}</h3>

      <p className="text-gray-600 mb-4">
        Statut : {report.status}
      </p>

      <div className="flex gap-3">
        <Button onClick={() => handleView(report.id)} disabled={loading}>
          Voir
        </Button>

        <Button
          onClick={() => handleDownload(report.id)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          Télécharger
        </Button>
      </div>
    </Card>
  )
}

export default ReportCard