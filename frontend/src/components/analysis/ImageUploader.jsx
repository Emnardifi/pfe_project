import { useState } from "react"
import Button from "../common/Button"

const ImageUploader = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (selectedFile) => {
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Veuillez choisir une image valide")
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleFileChange = (e) => {
    selectFile(e.target.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    selectFile(droppedFile)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!file) {
      alert("Choisis une image d'abord")
      return
    }

    onUpload(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-blue-300 bg-white"
        }`}
      >
        {preview ? (
          <div className="mb-5">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-72 rounded-xl border object-contain shadow-sm"
            />
          </div>
        ) : (
          <div className="mb-4 text-5xl">☁️</div>
        )}

        <p className="font-medium text-slate-700">
          {isDragging
            ? "Déposez l’image ici"
            : "Glissez et déposez votre image ici"}
        </p>

        <p className="my-3 text-sm text-slate-400">ou</p>

        <label className="inline-block cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Choisir une image

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <p className="mt-4 text-sm text-slate-400">
          Formats acceptés : JPG, PNG, JPEG
        </p>

        {file && (
          <p className="mt-3 text-sm font-medium text-slate-600">
            Fichier choisi : {file.name}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Analyse en cours..." : "Lancer l’analyse"}
      </Button>
    </form>
  )
}

export default ImageUploader