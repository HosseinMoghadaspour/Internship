import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiMessageSquare,
  FiUsers,
  FiSend,
  FiBell,
} from "react-icons/fi";
import UsersManagement from "../UsersManagment/UsersManagment";
import CompanyManagement from "../CompaniesManagement/CompaniesManagement";
import CommentManagement from "../CommentManagment/CommentManagment";
import ChatManagment from "../ChatManagment/ChatManagment";
import { getProfile } from "../../../types/GetProfile";

type User = {
  id: number;
  username: string;
  img?: string | null;
};

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ElementType;
}

// منوی ویرایش شده
const menuItems: MenuItem[] = [
  {
    id: "companies",
    label: "مدیریت شرکت‌ها",
    icon: FiCheckCircle,
    component: CompanyManagement,
  },
  {
    id: "users",
    label: "مدیریت کاربران",
    icon: FiUsers,
    component: UsersManagement,
  },
  {
    id: "comments",
    label: "مدیریت کامنت‌ها",
    icon: FiMessageSquare,
    component: CommentManagement,
  },
  {
    id: "Chat",
    label: "مدیریت پیام‌رسان",
    icon: FiSend,
    component: ChatManagment,
  },
];

const AdminDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("companies");
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const data = await getProfile();
          console.log(data);
          setUser(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const ActiveComponent =
    menuItems.find((item) => item.id === activeComponent)?.component ||
    CompanyManagement;

  return (
    <div dir="rtl" className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-2xl font-bold ml-2">پنل ادمین</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveComponent(item.id);
              }}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeComponent === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 ml-3" />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">© 2024 - تمام حقوق محفوظ است.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.id === activeComponent)?.label}
            </h2>
          </div>
          <div className="flex items-center space-x-reverse space-x-6 gap-3">
            
            <div className="flex items-center">
              {user?.img ? (
                <img
                  src={user.img}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {user?.username[0]?.toUpperCase()}
                </div>
              )}
              <div className="mr-3">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.username}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
