import api from "./api"

export const predictImage = async (imageFile) => {
  const formData = new FormData()
  formData.append("file", imageFile)

  const response = await api.post("/analyses/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const getMyAnalyses = async () => {
  const response = await api.get("/analyses/history")
  return response.data
}

export const getAnalysisById = async (analysisId) => {
  const response = await api.get(`/analyses/${analysisId}`)
  return response.data
}

export const getAnalysisResult = async (analysisId) => {
  const response = await api.get(`/analyses/${analysisId}/result`)
  return response.data
}

export const deleteAnalysis = async (analysisId) => {
  const response = await api.delete(`/analyses/${analysisId}`)
  return response.data
}

export const getHeatmapBlob = async (analysisId) => {
  const response = await api.get(`/analyses/${analysisId}/heatmap`, {
    responseType: "blob",
  })

  return URL.createObjectURL(response.data)
}

export const getOriginalImageUrl = (analysisId) => {
  return `${api.defaults.baseURL}/analyses/${analysisId}/image`
}


export const getOriginalImageBlob = async (analysisId) => {
  const response = await api.get(`/analyses/${analysisId}/image`, {
    responseType: "blob",
  })

  return URL.createObjectURL(response.data)
}