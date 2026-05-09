import api from "./api"

export const getMyProfile = async () => {
  const response = await api.get("/users/me")
  return response.data
}

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/me", profileData)
  return response.data
}

export const changePassword = async (passwordData) => {
  const response = await api.put("/users/me/password", passwordData)
  return response.data
}

export const updateAvatar = async () => {
  const response = await api.put("/users/me/avatar")
  return response.data
}

export const deleteMyAccount = async () => {
  const response = await api.delete("/users/me")
  localStorage.removeItem("token")
  return response.data
}