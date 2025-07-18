import api from "./api";

export const Approved = async () => {
  const response = await api.get("/admin/companies/verified"); 
  if (!response) throw new Error("خطا در دریافت اطلاعات شرکت‌ها");
  return response.data.companies;
};
