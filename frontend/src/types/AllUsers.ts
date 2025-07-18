import api from "./api";

export const AllUsers = async () => {
  const response = await api.get("/admin/users"); 
  if (!response) throw new Error("خطا در دریافت اطلاعات کاربران");
  console.log(response);
  return response.data;
};
