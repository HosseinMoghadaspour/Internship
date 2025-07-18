import api from './api';

export interface Company {
  id: number;
  name: string;
  description: string;
  province: string;
  city: string;
  address: string;
  is_verified: boolean;
  created_at: string;
  images: {
    id: number;
    url: string;
  }[];
}

export const getCompaniesByUserId = async (userId: number): Promise<Company[]> => {
  const response = await api.get(`/users/${userId}/companies`);
console.log(response);
  return response.data;
};