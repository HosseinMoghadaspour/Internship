import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import api from "../../../types/api";
import {UserCircle2 } from "lucide-react";

type User = {
  id: number;
  username: string;
  img?: string | null;
};

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  created_at: string;
};

const ChatWindow: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = user.id;

  const fetchMessages = () => {
    setIsLoading(true);
    api
      .get(`/messages/${user.id}`)
      .then((res) => {
        setMessages(
          res.data.sort(
            (a: Message, b: Message) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
        ); // مرتب‌سازی پیام‌ها بر اساس تاریخ
      })
      .catch((error) => console.error("Error fetching messages:", error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const tempMessageId = Date.now();

    const newMessage: Message = {
      id: tempMessageId,
      sender_id: currentUserId,
      receiver_id: user.id,
      text: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    api
      .post("/messages", {
        receiver_id: user.id,
        message: text,
      })
      .then((res) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempMessageId ? res.data : msg))
        );
      })
      .catch((error) => {
        console.error("Error sending message:", error);

        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempMessageId)
        );
      });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 rounded-xl shadow-xl overflow-hidden">
      <div className="p-4 bg-white shadow-sm border-b border-gray-200 flex items-center gap-3 rounded-t-xl">
        {user.img ? (
          <img
            src={`http://localhost:8000/storage/${user.img}`}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <UserCircle2 size={40} className="text-gray-500" />
        )}
        <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">در حال بارگذاری پیام‌ها...</p>
          </div>
        ) : messages.length === 0 && !isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              هنوز پیامی وجود ندارد. اولین پیام را ارسال کنید!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender_id === currentUserId; // مقایسه با ID کاربر لاگین شده
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`flex flex-col max-w-xs lg:max-w-md px-3 py-2 rounded-xl shadow-md group
                    ${
                      isSender
                      ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        : "bg-blue-600 text-white rounded-br-none"
                    }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  <span
                    className={`text-xs mt-1 self-end opacity-70 group-hover:opacity-100 transition-opacity duration-200 ${
                      !isSender ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl shadow-inner">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
