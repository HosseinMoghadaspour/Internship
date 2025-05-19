import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export async function login(username: string, password: string) {
  try {
    const response = await api.post("/login", { username, password });
    const token = response.data.data.token;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در ورود");
    }
    throw new Error("خطای نامشخص در ورود");
  }
}
