import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { getProfile } from "../../../types/GetProfile";
import { getCompaniesByUserId } from "../../../types/userCompaniesApi";
import Footer from "../../../components/Footer";

// Interface for User
interface User {
  id: number;
  username: string;
  img?: string;
  mobile: number;
  is_admin: boolean;
  created_at: string;
}

// Interface for Company
interface Company {
  id: number;
  name: string;
  description: string;
  province: string;
  city: string;
  address: string;
  is_verified: boolean;
  created_at: string;
  images: {
    id: number;
    image_path: string;
  }[];
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // State for editable user data
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  // State to track which company is being edited
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editableCompanies, setEditableCompanies] = useState<Company[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect for fetching user and company data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        let userData = user;
        if (!userData) {
          userData = await getProfile();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Fetch companies if user exists
        if (userData?.id) {
          const companiesData = await getCompaniesByUserId(userData.id);
          setCompanies(companiesData);
          setEditableCompanies(companiesData);
        }
      } catch (err) {
        setError("خطایی در دریافت اطلاعات رخ داد.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- User Action Handlers ---

  const handleUserEdit = () => {
    setEditableUser({ ...user! });
    setIsEditingUser(true);
    setImagePreview(user?.img || null);
  };

  const handleUserCancel = () => {
    setIsEditingUser(false);
    setEditableUser(null);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleUserSave = async () => {
    if (!editableUser) return;

    const updatedUser = { ...editableUser };
    if (imagePreview && imagePreview !== user?.img) {
      updatedUser.img = imagePreview;
    }

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditingUser(false);
    alert("تغییرات پروفایل با موفقیت ثبت شد.");
  };

  const handleUserDelete = async () => {
    if (
      window.confirm(
        "آیا از حذف حساب کاربری خود اطمینان دارید؟ این عمل غیرقابل بازگشت است."
      )
    ) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("حساب کاربری شما با موفقیت حذف شد.");
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCompanyEdit = (companyId: number) => {
    setEditingCompanyId(companyId);
  };

  const handleCompanyCancel = () => {
    setEditingCompanyId(null);
    setEditableCompanies([...companies]);
  };

  const handleCompanySave = async (companyId: number) => {
    const companyToSave = editableCompanies.find((c) => c.id === companyId);
    setCompanies([...editableCompanies]);
    setEditingCompanyId(null);
    alert(`تغییرات شرکت ${companyToSave?.name} با موفقیت ثبت شد.`);
  };

  const handleCompanyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    companyId: number
  ) => {
    const { name, value } = e.target;
    setEditableCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, [name]: value } : c))
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={
                    isEditingUser
                      ? imagePreview || "/default-avatar.png"
                      : user?.img || "/default-avatar.png"
                  }
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 object-cover"
                />
                {isEditingUser && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    title="تغییر عکس پروفایل"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {!isEditingUser ? (
                <div className="text-center mt-4">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.username}
                  </h1>
                  <p className="text-md text-blue-600 font-medium mt-1">
                    {user?.mobile}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {user?.is_admin ? "ادمین" : "کاربر"}
                  </p>
                  <button
                    onClick={handleUserEdit}
                    className="mt-6 w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    ویرایش پروفایل
                  </button>
                  <button
                    onClick={handleUserDelete}
                    className="mt-2 w-full px-4 py-2 font-medium text-red-600 bg-transparent rounded-lg hover:bg-red-50"
                  >
                    حذف حساب کاربری
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-right mt-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      نام کاربری
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={editableUser?.username || ""}
                      onChange={handleUserInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      موبایل
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      value={editableUser?.mobile || ""}
                      onChange={handleUserInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-x-2 pt-4">
                    <button
                      onClick={handleUserCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleUserSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      ثبت تغییرات
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  شرکت‌های ثبت‌شده
                </h2>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                  ثبت شرکت جدید
                </button>
              </div>
              {isLoading && <p>در حال بارگذاری...</p>}
              {error && <p className="text-red-500">{error}</p>}

              <div className="space-y-4">
                {!isLoading &&
                  Array.isArray(editableCompanies) &&
                  editableCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300"
                    >
                      {editingCompanyId === company.id ? (
                        <div className="space-y-3 text-right">
                          <div className="flex gap-5">
                            {company.images.map((img) => (
                              <img
                                src={`http://localhost:8000/storage/${img.image_path}`}
                                alt={`${company.name} logo`}
                                className="w-30 h-30 rounded-md object-cover"
                              />
                            ))}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              نام شرکت
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={company.name}
                              onChange={(e) =>
                                handleCompanyInputChange(e, company.id)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              توضیحات
                            </label>
                            <textarea
                              name="description"
                              value={company.description}
                              onChange={(e) =>
                                handleCompanyInputChange(e, company.id)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={3}
                            ></textarea>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              استان
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={company.province}
                              onChange={(e) =>
                                handleCompanyInputChange(e, company.id)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              شهر
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={company.city}
                              onChange={(e) =>
                                handleCompanyInputChange(e, company.id)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex justify-end gap-x-2 pt-2">
                            <button
                              onClick={handleCompanyCancel}
                              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                              انصراف
                            </button>
                            <button
                              onClick={() => handleCompanySave(company.id)}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                              ثبت
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <img
                            src={`http://localhost:8000/storage/${company.images[0].image_path}`}
                            alt={`${company.name} logo`}
                            className="w-30 h-30 rounded-md object-cover"
                          />
                          <div className="flex-1 text-right">
                            <p className="font-semibold text-gray-800">
                              {company.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              توضیحات : {company.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              استان : {company.province}
                            </p>
                            <p className="text-sm text-gray-500">
                              شهر : {company.city}
                            </p>
                            <p className="text-sm text-gray-500">
                              معرفی در تاریخ :{" "}
                              {new Date(company.created_at).toLocaleDateString(
                                "fa-IR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCompanyEdit(company.id)}
                            className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
