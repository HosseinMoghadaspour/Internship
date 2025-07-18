import React, { useState } from "react";

type User = {
  id: number;
  username: string;
  img: string | null;
};

type Props = {
  users: User[]; // کاربران را به عنوان prop دریافت می‌کند
  onSelectUser: (user: User) => void;
  selectedUserId?: number;
};

const ChatList: React.FC<Props> = ({ users, onSelectUser, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // دیگر نیازی به useEffect برای fetch کردن کاربران نیست

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-xl border border-gray-200">
      {/* بقیه کد بدون تغییر باقی می‌ماند */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl">
        <h2 className="text-xl font-semibold text-white text-center">
          لیست کاربران
        </h2>
      </div>
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="جستجوی کاربر..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="flex-grow overflow-y-auto divide-y divide-gray-200">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 ease-in-out transform
                ${
                  selectedUserId === user.id
                    ? "bg-blue-100 border-r-4 border-blue-500 shadow-inner"
                    : "hover:bg-gray-100"
                }`}
            >
              {/* بقیه JSX بدون تغییر */}
              <div className="relative">
                {user.img ? (
                  <img
                    src={`http://localhost:8000/storage/${user.img}`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {user.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-md font-semibold text-gray-800">
                  {user.username}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">کاربری یافت نشد.</p>
        )}
      </ul>
    </div>
  );
};

export default ChatList;