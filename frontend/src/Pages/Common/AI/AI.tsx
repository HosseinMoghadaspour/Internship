import React, { useState, useRef, useEffect } from "react";
import { askAI } from "../../../types/AI";
import { IoSend } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { MdErrorOutline, MdVpnKey } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";
import Navbar from "../../../components/Navbar";
import ChatGif from "../../../assets/Chat_bot.gif";
import Footer from "../../../components/Footer";

// Define a type for our message object
type Message = {
  sender: "user" | "ai";
  text: string;
};

function GeminiChat() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError("لطفاً پیامی بنویسید.");
      return;
    }

    setError(null);
    const userMessage: Message = { sender: "user", text: trimmedInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const textResponse = await askAI(trimmedInput);
      const aiMessage: Message = {
        sender: "ai",
        text: textResponse || "پاسخ مشخصی دریافت نشد.",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "یک خطای ناشناخته رخ داد.";
      setError(`خطا در دریافت پاسخ: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-start justify-center w-full max-w-screen-xl mx-auto mt-7 space-y-6 lg:space-y-0 lg:space-x-6 p-4">
        <div className="hidden xl:flex flex-col items-center justify-start w-full lg:w-1/4 pt-8">
          <img
            src={ChatGif}
            alt="Chat bot animation"
            className="w-full max-w-xs"
          />
        </div>
        <div
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl w-full flex-1 flex flex-col overflow-hidden"
          style={{
            height: "calc(90vh - 3rem)",
            maxHeight: "750px",
            minHeight: "400px",
          }}
        >
          <header className="p-4 sm:p-5 border-b border-slate-300/70 flex items-center space-x-3 bg-slate-100/70">
            <BsStars className="text-3xl text-purple-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              چت با AI
            </h1>
          </header>

          <main className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.length === 0 && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center h-[96%] text-slate-500 animate-fadeIn">
                <RiRobot2Line size={48} className="mb-2" />
                <p>سلام! چطور می‌تونم کمکتون کنم؟</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex animate-fadeIn ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="mr-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-violet-600 flex items-center justify-center text-white shadow">
                      <BsStars size={18} />
                    </div>
                  </div>
                )}
                <div
                  className={`p-3 sm:p-4 rounded-xl shadow-md max-w-[85%] sm:max-w-[80%] break-words ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-tl-none"
                      : "bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-tr-none"
                  }`}
                >
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-violet-600 flex items-center justify-center text-white shadow">
                    <BsStars size={18} />
                  </div>
                </div>
                <div className="bg-gray-200 p-4 rounded-xl rounded-tl-none animate-pulse">
                  <AiOutlineLoading className="animate-spin text-xl text-purple-500" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start space-x-2 p-3 bg-red-100 text-red-700 rounded-xl shadow animate-fadeIn">
                <MdErrorOutline className="text-2xl text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">خطا</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="p-3 sm:p-4 border-t border-slate-300/70 bg-slate-100/70">
            <form
              onSubmit={handleSubmit}
              className="flex items-end space-x-2 sm:space-x-3"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="پیام خود را بنویسید..."
                className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-all bg-white/90 placeholder-slate-400 text-slate-800 text-sm sm:text-base max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center aspect-square h-full"
              >
                {isLoading ? (
                  <AiOutlineLoading className="animate-spin text-xl sm:text-2xl" />
                ) : (
                  <IoSend className="text-xl sm:text-2xl" />
                )}
              </button>
            </form>
          </footer>
        </div>

        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md animate-fadeIn">
            <div className="flex items-center">
              <MdVpnKey className="text-3xl text-yellow-600 ml-3" />
              <h3 className="font-bold">توجه</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              برای استفاده حتما VPN خود را روشن کنید و از آی‌پی ایران استفاده
              نکنید.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GeminiChat;