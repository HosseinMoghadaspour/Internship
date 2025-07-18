import api from "./api";
// تابع برای دریافت هم‌صحبت‌های یک کاربر
export const getChatPartners = async (userId: number) => {
  const response = await api.get(`/admin/messages/user/${userId}/chats`);
  if (!response) {
    throw new Error('Network response was not ok');
  }
  return response.data;
};

// تابع برای دریافت مکالمه بین دو کاربر
export const getConversation = async (user1Id: number, user2Id: number) => {
  const response = await api.get(`/admin/messages/conversation/${user1Id}/${user2Id}`);
  if (!response) {
    throw new Error('Network response was not ok');
  }
   console.log(response)
  return response.data;
};