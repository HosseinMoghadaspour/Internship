import axios from "axios";
import api from "./api"; // مسیر دقیق به api.ts

export async function logout() {
  try {
    const token = localStorage.getItem("token");
   const response = await api.post("/logout", {} ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا !!!");
    }
    throw new Error("خطای نامشخص !!!");
  }
}
