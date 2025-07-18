import axios from "axios";
import api from "./api";

type User = {
  id: number;
  username: string;
  mobile: string;
  img: string | null;
  is_admin: number;
  password?: string;
};

type UpdateUserPayload = {
  username: string;
  is_admin: number;
  password?: string;
  img?: string | null;
};

export async function updateUser(id: number, modalData: User) {
  try {
    const payload: UpdateUserPayload = {
      username: modalData.username,
      is_admin: modalData.is_admin,
    };

    if (modalData.password) {
      payload.password = modalData.password;
    }

    if ('img' in modalData) {
      payload.img = modalData.img;
    }

    const response = await api.post(`/admin/users/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "خطا در بروزرسانی اطلاعات کاربر!");
    }
    throw new Error("خطای ناشناخته در بروزرسانی اطلاعات کاربر!");
  }
}
