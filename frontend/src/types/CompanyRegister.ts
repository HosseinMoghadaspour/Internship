import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export async function company(
  name: string,
  province: string,
  city: string,
  description: string,
  introduced_by: number,
  images: File[]
) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("province", province);
  formData.append("description", description);
  formData.append("city", city);
  formData.append("introduced_by", introduced_by.toString());

  // افزودن عکس‌ها
  images.forEach((file) => {
    formData.append("images[]", file);
  });

  try {
    const response = await api.post("/companies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // اگر خواستی اطلاعات برگشتی مثل آیدی شرکت جدید رو استفاده کنی
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در ورود");
    }
    throw new Error("خطای نامشخص در ورود");
  }
}
