import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiUserX, FiX } from "react-icons/fi";
import { AllUsers } from "../../../types/AllUsers";
import { deleteUser } from "../../../types/DeleteUser";
import { updateUser } from "../../../types/UpdateUser.ts";

type User = {
  id: number;
  username: string;
  mobile: string;
  img: string | null;
  is_admin: number;
};

const UsersManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalData, setModalData] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AllUsers();
      setUsers(response);
    } catch (err) {
      console.error("خطا در دریافت کاربران:", err);
      setError("دریافت اطلاعات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error("خطا در حذف کاربر:", err);
      setError("حذف کاربر با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setModalData({
      username: user.username,
      mobile: user.mobile,
      id: user.id,
      img: user.img,
      is_admin: user.is_admin,
    });
    setIsEditModalOpen(true);
    setError(null); // Clear previous errors
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setModalData(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !modalData) return;

    setLoading(true);
    setError(null);
    try {
      // فرض بر این است که تابع updateUser شناسه و داده‌های جدید را می‌گیرد
      const updatedUserData = await updateUser(editingUser.id, modalData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedUserData } : user
        )
      );
      handleCloseEditModal();
    } catch (err) {
      console.error("خطا در به‌روزرسانی کاربر:", err);
      setError("به‌روزرسانی کاربر با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery)
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-indigo-700 text-right">
            لیست کاربران
          </h2>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا موبایل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-right"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg text-right">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-4 font-semibold text-indigo-700">کاربر</th>
                <th className="p-4 font-semibold text-indigo-700">موبایل</th>
                <th className="p-4 font-semibold text-indigo-700">نقش</th>
                <th className="p-4 font-semibold text-indigo-700">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="p-4 flex items-center justify-start gap-3 text-right">
                    {user.img ? (
                      <img
                        src={`http://localhost:8000/storage/${user.img}`}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow">
                        {user.username[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-md font-semibold text-gray-800">
                      {user.username}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.mobile}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                        user.is_admin
                          ? "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.is_admin ? "ادمین" : "کاربر"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition"
                        title="ویرایش"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                        title="حذف"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditModalOpen && editingUser && modalData && (
        <div className="fixed inset-0 bg-white opacity-90 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">ویرایش کاربر</h3>
              <button
                onClick={handleCloseEditModal}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <FiX size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded text-right">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4 text-right">
              <div className="flex items-center gap-4">
                {editingUser.img ? (
                  <img
                    src={`http://localhost:8000/storage/${editingUser.img}`}
                    alt={editingUser.username}
                    className="w-40 h-40 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {editingUser.username[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {editingUser.img && (
                    <button
                      type="button"
                      onClick={()=>setModalData({...modalData, img: null})}
                      disabled={loading}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiUserX /> حذف تصویر
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block mb-1 font-medium">
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  value={modalData.username}
                  onChange={(e) =>
                    setModalData({ ...modalData, username: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block mb-1 font-medium">
                  موبایل
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={modalData.mobile}
                  onChange={(e) =>
                    setModalData({ ...modalData, mobile: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  value={modalData.username}
                  onChange={(e) =>
                    setModalData({ ...modalData, username: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  موبایل
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={modalData.mobile}
                  onChange={(e) =>
                    setModalData({ ...modalData, mobile: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block mb-1 font-medium">
                  نقش
                </label>
                <select
                  id="role"
                  value={modalData.is_admin}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      is_admin: Number(e.target.value),
                    })
                  }
                  className="w-50 p-2 border rounded-md bg-white"
                >
                  <option value="0">کاربر</option>
                  <option value="1">ادمین</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
                >
                  {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;
