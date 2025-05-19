import { useEffect, useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import { FaUserCircle } from "react-icons/fa";
import Snackbar from "./Snackbar";
import { logout } from "../types/Logout";
import { useNavigate } from "react-router-dom";

const UserMenu: React.FC<{
  UserImg?: string;
  UserName?: string;
  isLoading?: boolean;
}> = ({ UserImg, UserName, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logout();
      localStorage.removeItem("token"); // حذف توکن
      setSnackbar({ message: "خروج با موفقیت انجام شد!", type: "success" });
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 500);
    } catch (error) {
      setSnackbar({
        message: "خطا در خروج! لطفاً مجدد تلاش کنید.",
        type: "error",
      });
      console.log(error);
    }
  };

  return (
    <div
      className="relative flex items-center"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center space-y-1 cursor-pointer">
        {isLoading ? (
          <Skeleton circle width={56} height={56} />
        ) : UserImg === "" ? (
          <FaUserCircle className="w-10 h-10" />
        ) : (
          <img
            src={UserImg}
            alt="پروفایل"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col items-center">
          {isLoading ? (
            <Skeleton width={70} height={20} />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{UserName}</p>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-full top-15  w-56 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-200 transition-all duration-200">
          <ul className="text-gray-800 text-sm font-medium divide-y divide-gray-100">
            <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
              <FaUserCircle className="w-5 h-5 text-blue-500" />
              <span>شرکت‌های ثبت شده من</span>
            </li>
            <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
              <FaUserCircle className="w-5 h-5 text-green-500" />
              <span>اطلاعات کاربری</span>
            </li>
            <li
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors text-red-600"
              onClick={handleLogOut}
            >
              <BiLogOut className="w-5 h-5" />
              <span>خروج از حساب</span>
            </li>
          </ul>
        </div>
      )}
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
    </div>
  );
};

export default UserMenu;
