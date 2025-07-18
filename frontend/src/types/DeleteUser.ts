import axios from "axios";
import api from "./api";

export async function deleteUser(id: number) {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در حذف کاربر!");
    }
    throw new Error("خطای ناشناخته در حذف کاربر!");
  }
}
