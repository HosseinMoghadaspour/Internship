import api from "./api";

export const Unapproved = async () => {
  const response = await api.get("/admin/companies/unverified"); 
  if (!response) throw new Error("خطا در دریافت اطلاعات شرکت‌ها");
  return response.data.companies;
};
