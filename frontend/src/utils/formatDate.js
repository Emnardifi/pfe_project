export const formatDate = (date) => {
  if (!date) return "N/A"

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}