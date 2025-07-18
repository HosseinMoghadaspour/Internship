import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export async function signin(
  username: string,
  password: string,
  mobile: string,
  profileImage: File | null
) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("mobile" , mobile);
  if (profileImage) {
    formData.append("img", profileImage);
  }

  try {
    const response = await api.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const token = response.data.data.token;
    localStorage.setItem("token", token);
    console.log(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در ورود");
    }
    throw new Error("خطای نامشخص در ورود");
  }
}
