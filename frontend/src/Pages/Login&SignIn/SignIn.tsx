import React, { useState } from "react";
import Icon from "../../assets/RahAmooz.png";
import { signin } from "../../types/SignIn";
import { useNavigate } from "react-router-dom";
import { RxFace } from "react-icons/rx";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signin(username, password, mobile , profileImage);
      setSnackbar({ message: "ثبت‌نام با موفقیت انجام شد!", type: "success" });
      setTimeout(() => {
        setSnackbar(null);
        navigate("/");
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("خطا در ورود", error);
      setSnackbar({
        message: "خطا در ثبت‌نام! لطفاً مجدد تلاش کنید.",
        type: "error",
      });

      setTimeout(() => {
        setSnackbar(null);
      }, 4000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-500 p-4">
        <div className="text-center w-[400px]">
          <img src={Icon} alt="Icon" className="w-40 h-40 mx-auto mb-4" />
          <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6">
            <h2 className="text-3xl font-bold text-center text-indigo-700">
              ثبت‌ نام
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <label htmlFor="upload" className="cursor-pointer">
                  <div className="w-32 h-32 rounded-full border flex items-center justify-center overflow-hidden bg-gray-200 hover:opacity-80 transition">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="پیش‌نمایش"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <RxFace className="text-6xl text-gray-400" />
                    )}
                  </div>
                </label>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    X
                  </button>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1" htmlFor="username">
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1" htmlFor="username">
                  شماره تلفن
                </label>
                <input
                  id="mobile"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1" htmlFor="password">
                  رمز عبور
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
              >
                ورود
              </button>
            </form>
            <p className="text-sm text-center text-gray-500">
              حساب کاربری دارید؟{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                ورود
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 animate-fadeIn z-50
            ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {snackbar.message}
        </div>
      )}
    </>
  );
};

export default LoginForm;
