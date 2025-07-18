import api from "./api";

export const ListOfCompanies = async () => {
  const response = await api.get("/companies"); 
  if (!response) throw new Error("خطا در دریافت اطلاعات شرکت‌ها");
  return response.data.companies;
};
