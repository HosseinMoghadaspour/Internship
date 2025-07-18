import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { AllUsers } from "../../../types/AllUsers";
import { getChatPartners, getConversation } from "../../../types/ChatUser";

type User = {
  id: number;
  username: string;
  mobile: string;
  img: string;
  is_admin: number;
};

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string; 
};

const MessageManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatPartners, setChatPartners] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AllUsers();
        setUsers(response);
      } catch (err) {
        setError("دریافت اطلاعات با مشکل مواجه شد.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setSelectedChat(null);
    setMessages([]);
    try {
      const response = await getChatPartners(user.id);
      setChatPartners(response);
    } catch (err) {
      console.error("خطا در دریافت چت‌ها:", err);
    }
  };

  const handleChatClick = async (partner: User) => {
    if (!selectedUser) return;
    setSelectedChat(partner);
    try {
      const conversation = await getConversation(selectedUser.id, partner.id);
      setMessages(conversation);
    } catch (err) {
      console.error("خطا در دریافت مکالمه:", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-md">
      {/* ستون اول: لیست کاربران */}
      <div className="w-1/4 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی کاربر..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 gap-4 ${
                selectedUser?.id === user.id ? "bg-indigo-50" : ""
              }`}
            >
              {user.img ? (
                <img
                  src={`http://localhost:8000/storage/${user.img}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-gray-700">
                {user.username}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ستون دوم: چت‌های کاربر انتخاب‌شده */}
      <div className="w-1/4 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b h-[73px]">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedUser
              ? `چت‌های ${selectedUser.username}`
              : "یک کاربر انتخاب کنید"}
          </h2>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {chatPartners.map((partner) => (
            <li
              key={partner.id}
              onClick={() => handleChatClick(partner)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 gap-4 ${
                selectedChat?.id === partner.id ? "bg-indigo-50" : ""
              }`}
            >
               <div className="relative">
                {partner.img ? (
                  <img
                    src={`http://localhost:8000/storage/${partner.img}`}
                    alt={partner.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {partner.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{partner.username}</p>
                {/* <p className="text-sm text-gray-500 truncate">
                  {partner.lastMessage}
                </p> */}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ستون سوم: نمایش پیام‌ها */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center h-[73px] gap-4">
               <div className="relative">
                {selectedChat.img ? (
                  <img
                    src={`http://localhost:8000/storage/${selectedChat.img}`}
                    alt={selectedChat.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {selectedChat.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedChat.username}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === selectedUser?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender_id === selectedUser?.id
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>برای مشاهده پیام‌ها، یک گفتگو را انتخاب کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManagement;
