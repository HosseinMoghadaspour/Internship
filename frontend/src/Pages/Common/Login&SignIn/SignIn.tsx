import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiPhone, FiCamera, FiX } from "react-icons/fi";
import SignInGif from "../../../assets/signin.gif";
import Icon from "../../../assets/RahAmooz.png";
import { signin } from "../../../types/SignIn";

const AttractiveSignupForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signin(username, password, mobile, profileImage);
      setSnackbar({
        message: "حساب کاربری با موفقیت ایجاد شد!",
        type: "success",
      });
      setTimeout(() => {
        setSnackbar(null);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("خطا در ثبت‌نام", error);
      setSnackbar({
        message: "خطا در ایجاد حساب! لطفاً مجدد تلاش کنید.",
        type: "error",
      });
      setTimeout(() => setSnackbar(null), 4000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-200 flex items-center justify-center p-4">
        <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="w-full md:w-1/2 p-8 sm:p-12 space-y-6">
            <img src={Icon} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-center text-gray-800">
              ایجاد حساب کاربری
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <label
                    htmlFor="upload"
                    className="group cursor-pointer w-28 h-28 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-blue-500 hover:bg-gray-100 transition-all duration-300"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="پیش‌نمایش پروفایل"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <FiCamera className="mx-auto text-4xl transition-transform group-hover:scale-110" />
                        <span className="text-xs mt-1 font-semibold">
                          انتخاب تصویر
                        </span>
                      </div>
                    )}
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="حذف تصویر پروفایل"
                      className="absolute -top-1 -right-1 bg-white border border-gray-300 text-gray-600 rounded-full p-1.5 shadow-md hover:bg-red-500 hover:text-white hover:border-red-500 transition-all focus:outline-none"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="relative">
                <FiUser className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="نام کاربری"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-300 text-right"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="شماره تلفن"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-300 text-right"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="رمز عبور"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-300 text-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              >
                ایجاد حساب
              </button>
            </form>

            <p className="text-sm text-center text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                وارد شوید
              </Link>
            </p>
          </div>

          <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
            <img
              src={SignInGif}
              alt="Signin GIF"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {snackbar && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium z-50
            ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {snackbar.message}
        </div>
      )}
    </>
  );
};

export default AttractiveSignupForm;
