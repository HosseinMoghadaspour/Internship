"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import DrawerNavigation from "./DrawerNavigation";
import { IoHome } from "react-icons/io5";
import { PiBuildingApartment } from "react-icons/pi";
import Icon from "../assets/icon2.png";
import "react-loading-skeleton/dist/skeleton.css";
import { FaUserCircle } from "react-icons/fa";
import UserMenu from "./UserMenu";

const Navbar: React.FC<{
  UserImg?: string;
  UserName?: string;
  isLoading?: boolean;
}> = ({ UserImg, UserName, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const items = [
    {
      key: "menu",
      label: "دسته بندی",
      icon: <IoMdMenu className="w-6 h-6" />,
      href: "/menu",
    },
    {
      key: "home",
      label: "خانه",
      icon: <IoHome className="w-6 h-6" />,
      href: "/",
    },
    {
      key: "profile",
      label: UserName,
      icon:
        UserImg === "" ? (
          <FaUserCircle className="w-6 h-6" />
        ) : (
          <img
            src={UserImg}
            alt="پروفایل"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
      href: "/profile",
    },
  ];

  return (
    <>
      {!isMobile ? (
        <nav className="bg-gray-400 shadow-md p-2 sticky top-[25px] z-50 bg-opacity-50 backdrop-blur-md rounded-[30px] w-[98%] mx-auto ">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl gap-2 font-bold flex items-center">
              <img src={Icon} alt="ShopLogo" className="w-15 h-15" />
              <p className="text-blue-900">راه‌آموز</p>
            </div>
            <ul className="flex items-center gap-15 text-white text-lg font-bold">
              <li className="flex gap-2">
                <IoHome className="w-7 h-7" />
                <p>خانه</p>
              </li>
              <li className="flex gap-2">
                <PiBuildingApartment className="w-7 h-7" />
                شرکت‌ها
              </li>
              <li className="flex gap-2">
                <PiBuildingApartment className="w-7 h-7" />
                جستجو
              </li>
            </ul>
            {isLoggedIn ? (
              <UserMenu
                UserImg={UserImg}
                UserName={UserName}
                isLoading={isLoading}
              />
            ) : (
              <>
                <a
                  href="/login"
                  className="lg:flex relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  ثبت نام | ورود
                </a>
              </>
            )}
          </div>
        </nav>
      ) : (
        <>
          <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-md flex justify-around items-center p-5 z-50 rounded-b-2xl">
            <div className="container flex justify-between">
              <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                <DrawerNavigation />
              </button>
              {!isLoggedIn ? (
                <a
                  href="/login"
                  className="relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2"
                >
                  ثبت‌نام | ورود
                </a>
              ) : (
                <></>
              )}
            </div>
          </nav>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 z-50 rounded-t-2xl">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center text-purple-600"
              >
                <div className=" rounded-full ">{item.icon}</div>
                <span className="text-sm mt-1 font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
