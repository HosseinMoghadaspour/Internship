import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { PiBuildingApartment } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import UserMenu from "./UserMenu";
import { Link, useLocation } from "react-router-dom";
import Icon from "../assets/icon2.png";
import { getProfile } from "../types/CheckUser";

type User = {
  id: number;
  username: string;
  img: string | null;
  is_admin: boolean;
};

const Navbar: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { pathname } = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    const verifyUser = async () => {
      try {
        const isAdminStatus = await getProfile();
        setIsAdmin(isAdminStatus);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAdmin(false);
      }
    };

    verifyUser();

    setIsLoggedIn(!!token);

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("خطا در خواندن اطلاعات کاربر:", err);
      }
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      key: "menu",
      label: "شرکت ها",
      icon: <IoMdMenu className="w-6 h-6" />,
      href: "/listOfCompanies",
    },
    {
      key: "home",
      label: "خانه",
      icon: <IoHome className="w-6 h-6" />,
      href: "/",
    },
    {
      key: "profile",
      label: "پروفایل",
      icon: user?.img ? (
        <img
          src={user.img}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <FaUserCircle className="w-6 h-6" />
      ),
      href: "/profile",
    },
  ];

  return (
    <>
      {!isMobile ? (
        <nav className="bg-gray-400 shadow-md p-3 sticky top-5 z-50 bg-opacity-50 backdrop-blur-md rounded-[30px] w-[98%] mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={Icon} alt="Logo" className="w-12 h-12" />
              <span className="text-blue-900 text-xl font-bold">راه‌آموز</span>
            </div>
            <ul className="flex items-center gap-12 text-white text-lg font-bold">
              <Link to={"/"}>
                <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                  <IoHome className="w-6 h-6" />
                  <span>خانه</span>
                </li>
              </Link>
              <Link to={"/listOfCompanies"}>
                <li className="flex items-center gap-2 cursor-pointer  hover:text-yellow-300">
                  <PiBuildingApartment className="w-6 h-6" />
                  <span>شرکت‌ها</span>
                </li>
              </Link>
              <Link to={"/search"}>
                <li className="flex items-center gap-2 cursor-pointer  hover:text-yellow-300">
                  <CiSearch className="w-6 h-6" />
                  <span>جستجو</span>
                </li>
              </Link>
              {isAdmin && (
                <Link to={"/admin"}>
                  <li className="flex items-center gap-2 cursor-pointer  hover:text-yellow-300">
                    <FaUserCircle className="w-6 h-6" />
                    <span>پنل ادمین</span>
                  </li>
                </Link>
              )}
            </ul>
            {isLoggedIn ? (
              <UserMenu
                UserImg={user?.img || ""}
                UserName={user?.username || ""}
                isLoading={isLoading}
              />
            ) : (
              <a
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                ثبت نام | ورود
              </a>
            )}
          </div>
        </nav>
      ) : (
        <>
          {/* موبایل: نوار بالا */}
          <nav className="sticky top-0 w-full bg-white border-b shadow-sm z-50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={Icon} alt="Logo" className="w-12 h-12" />
              <span className="text-blue-900 text-xl font-bold">راه‌آموز</span>
            </div>
            {!isLoggedIn ? (
              <a
                href="/login"
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full"
              >
                ورود | ثبت‌نام
              </a>
            ) : (
              <UserMenu
                UserImg={user?.img || ""}
                UserName={user?.username || ""}
                isLoading={isLoading}
              />
            )}
          </nav>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around py-2 z-50 rounded-t-2xl">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  href={item.href}
                  key={item.key}
                  className={`flex flex-col items-center ${
                    isActive ? "text-purple-600" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      isActive ? "bg-purple-600 text-white shadow-md" : ""
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
