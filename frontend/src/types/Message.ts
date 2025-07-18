import api from "./api";

export const getMessages = async (receiverId: number) => {
  const res = await api.get(`/messages/${receiverId}`);
  console.log(res.data)
  return res.data;
};

export const sendMessage = async (receiverId: number, message: string) => {
  const res = await api.post('/messages', { receiver_id: receiverId, message });
  return res.data;
};
