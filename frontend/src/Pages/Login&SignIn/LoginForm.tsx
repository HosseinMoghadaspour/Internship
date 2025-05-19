import React, { useState } from "react";
import Icon from "../../assets/RahAmooz.png";
import Logo from "../../assets/Login (1).gif";
import { login } from "../../types/Login";
import { useNavigate } from "react-router-dom";
import Snackbar from "../../components/Snackbar";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login(username, password);
      setSnackbar({ message: "ورود با موفقیت انجام شد!", type: "success" });
      setTimeout(() => {
        setSnackbar(null);
        navigate("/");
      }, 3000);
    } catch (error) {
      setSnackbar({
        message: "خطا در ورود! لطفاً مجدد تلاش کنید.",
        type: "error",
      });
      setTimeout(() => {
        setSnackbar(null);
      }, 4000);
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#a8b5fc] p-4 ">
        <div className="text-center w-full">
          <img src={Icon} alt="Icon" className="w-40 h-40 mx-auto mb-4" />
          <div className="flex-grow flex items-center justify-center h-screen bottom-[50px] relative gap-4 ">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6">
              <h2 className="text-3xl font-bold text-center text-indigo-700">
                ورود به حساب
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
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
                حساب کاربری ندارید؟{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  ثبت‌نام
                </a>
              </p>
            </div>
            <div>
              <img src={Logo} alt="Login Icon" width={500} height={500} />
            </div>
          </div>
        </div>
      </div>

      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
    </>
  );
};

export default LoginForm;
