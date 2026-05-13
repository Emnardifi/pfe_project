import Card from "../common/Card"

const StatCard = ({ title, value, description, color = "blue" }) => {
  const colors = {
    blue: "border-blue-600 text-slate-900",
    green: "border-emerald-500 text-emerald-600",
    red: "border-red-500 text-red-600",
  }

  return (
    <Card className={`border-l-4 ${colors[color]}`}>
      <p className="text-gray-500">{title}</p>

      <h2 className={`mt-2 text-3xl font-bold ${colors[color]}`}>
        {value}
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        {description}
      </p>
    </Card>
  )
}

export default StatCard