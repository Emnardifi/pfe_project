import { useState } from "react"
import Button from "../common/Button"

const ImageUploader = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) return alert("Choisis une image d'abord")
    onUpload(file)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
      <label className="block mb-2 font-medium">Image X-ray</label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block w-full border rounded-lg p-2"
      />

      {file && (
        <p className="text-sm text-gray-500 mb-4">
          Fichier choisi : {file.name}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Analyse en cours..." : "Lancer l’analyse"}
      </Button>
    </form>
  )
}

export default ImageUploader