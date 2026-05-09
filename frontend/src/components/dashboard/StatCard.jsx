import Card from "../common/Card"

const StatCard = ({ title, value, icon }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  )
}

export default StatCard