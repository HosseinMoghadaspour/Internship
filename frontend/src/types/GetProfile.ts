import axios from "axios";
import api from "./api"; // مسیر دقیق به api.ts

export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
   const response = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا !!!");
    }
    throw new Error("خطای نامشخص !!!");
  }
}
