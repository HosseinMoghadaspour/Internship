import api from "./api";

export const ApproveCompany = async (companyId: number) => {
  const response = await api.post(`/admin/companies/${companyId}`);
  if (response.status !== 200) { 
    throw new Error("خطا در تایید شرکت");
  }
  return response.data; 
};