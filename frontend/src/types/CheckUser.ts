import axios from "axios";
import api from "./api";

export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
   const response = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if(response.data.is_admin){
        return true;
    }
    else{
        return false;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا !!!");
    }
    throw new Error("خطای نامشخص !!!");
  }
}
