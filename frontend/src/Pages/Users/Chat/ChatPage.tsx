import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import Navbar from "../../../components/Navbar";
import { MessageSquareText, ArrowRight } from "lucide-react";
import api from "../../../types/api";

type User = {
  id: number;
  username: string;
  img?: string | null;
};

const ChatPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (username && users.length > 0) {
      const userFromUrl = users.find((u) => u.username === username);
      if (userFromUrl) {
        setSelectedUser(userFromUrl);
      } else {
        navigate("/chat");
      }
    } else {
      setSelectedUser(null);
    }
  }, [username, users, navigate]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    navigate(`/chat/${user.username}`);
  };

  const handleBack = () => {
    navigate("/chat");
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden p-4 sm:p-6 gap-4 sm:gap-6 mt-5">
        {/* نمایش فقط در حالت دسکتاپ */}
        {!isMobileView && (
          <div className="w-full sm:w-1/3 lg:w-1/4 h-full">
            <ChatList
              users={users}
              onSelectUser={handleSelectUser}
              selectedUserId={selectedUser?.id}
            />
          </div>
        )}

        {/* حالت موبایل: فقط یکی از دو بخش لیست یا چت */}
        <div className="flex-1">
          {isMobileView ? (
            selectedUser ? (
              <div className="relative">
                {/* دکمه برگشت */}
                <button
                  onClick={handleBack}
                  className="absolute top-0 right-0 p-2 z-10 text-blue-600 flex items-center gap-1"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm">بازگشت</span>
                </button>
                <div className="pt-10">
                  <ChatWindow key={selectedUser.id} user={selectedUser} />
                </div>
              </div>
            ) : (
              <ChatList
                users={users}
                onSelectUser={handleSelectUser}
                selectedUserId={selectedUser?.id}
              />
            )
          ) : selectedUser ? (
            <ChatWindow key={selectedUser.id} user={selectedUser} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              <MessageSquareText size={64} className="text-blue-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-2">به چت‌روم خوش آمدید!</h2>
              <p className="text-md">یک کاربر را از لیست سمت چپ برای شروع گفتگو انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
