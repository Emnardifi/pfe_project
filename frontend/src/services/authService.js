import api from "./api"

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me")
  return response.data
}

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh")
  return response.data
}

export const logoutUser = async () => {
  await api.post("/auth/logout")
  localStorage.removeItem("token")
}

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export const resetPassword = async (token, new_password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    new_password,
  })

  return response.data
}

export const verifyEmail = async () => {
  const response = await api.post("/auth/verify-email")
  return response.data
}

export const resendVerification = async () => {
  const response = await api.post("/auth/resend-verification")
  return response.data
}