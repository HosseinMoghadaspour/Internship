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
  introduced_by: string,
  address: string,
  images: File[]
) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("province", province);
  formData.append("description", description);
  formData.append("city", city);
  formData.append("address", address);
  formData.append("introduced_by", introduced_by.toString());
  images.forEach((file) => {
    formData.append("images[]", file);
  });
  console.log(introduced_by);
  try {
    const response = await api.post("/companyRegister", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // اگر خواستی اطلاعات برگشتی مثل آیدی شرکت جدید رو استفاده کنی
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در ثبت");
    }
    throw new Error("خطای نامشخص در ثبت");
  }
}
