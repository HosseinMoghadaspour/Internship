import React, { useEffect, useState } from "react";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { Unapproved } from "../../../types/Unapproved";
import { Approved } from "../../../types/Approved";
import { ApproveCompany } from "../../../types/UpdateCompany";
import Snackbar from "../../../components/Snackbar";
import CompanyDetailsManagment from "./CompanyDetailsManagment";
import { deleteCompany } from "../../../types/DeleteCompany"

type Company = {
  id: number;
  name: string;
  province: string | null;
  city: string | null;
  description: string | null;
  images: { id: number; image_path: string }[];
  introduced_by: { username: string };
};

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState("unapproved");
  const [unapprovedCompanies, setUnapprovedCompanies] = useState<Company[]>([]);
  const [approvedCompanies, setApprovedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseUnapproved = await Unapproved();
        const responseApproved = await Approved();

        setUnapprovedCompanies(responseUnapproved);
        setApprovedCompanies(responseApproved);
      } catch (err) {
        console.error("خطا در دریافت شرکت‌ها:", err);
        setError("دریافت اطلاعات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleApproveCompany = async (companyId: number) => {
    try {
      await ApproveCompany(companyId);
      const companyToMove = unapprovedCompanies.find((c) => c.id === companyId);
      if (companyToMove) {
        setUnapprovedCompanies((prev) =>
          prev.filter((c) => c.id !== companyId)
        );
        setApprovedCompanies((prev) => [...prev, companyToMove]);
      }
      setSnackbar({ message: "شرکت با موفقیت تایید شد", type: "success" });
    } catch (err) {
      console.error("خطا در تایید شرکت:", err);
      setError("عملیات تایید شرکت با مشکل مواجه شد.");
      setSnackbar({
        message: "عملیات تایید شرکت با مشکل مواجه شد.",
        type: "error",
      });
    }
  };


  const handleDeleteCompany = async (id: number) => {
      if (!window.confirm("آیا از حذف این شرکت مطمئن هستید؟")) return;
  
      setLoading(true);
      setError(null);
      try {
        await deleteCompany(id);
        setApprovedCompanies((prevUsers) => prevUsers.filter((company) => company.id !== id));
      } catch (err) {
        console.error("خطا در حذف شرکت:", err);
        setError("حذف شرکت با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };


  return (
    <div>
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
      {selectedCompany ? (
        <CompanyDetailsManagment
          company={selectedCompany}
          onBack={() => setSelectedCompany(null)}
        />
      ) : (
        <>
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("unapproved")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "unapproved"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              در انتظار تایید ({unapprovedCompanies.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "approved"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              تایید شده ({approvedCompanies.length})
            </button>
          </div>
          <div className="mt-6">
            {activeTab === "unapproved" && (
              <div>
                {loading && (
                  <p className="text-center text-gray-500">
                    در حال بارگذاری...
                  </p>
                )}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && unapprovedCompanies.length === 0 && (
                  <p className="text-center text-gray-500">
                    هیچ شرکت تایید نشده‌ای برای نمایش وجود ندارد.
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {!loading &&
                    !error &&
                    unapprovedCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between cursor-pointer"
                        onClick={() => setSelectedCompany(company)}
                      >
                        <div className="w-full h-48 sm:h-56 overflow-hidden">
                          {company.images.length > 0 ? (
                            <img
                              src={`http://localhost:8000/storage/${company.images[0].image_path}`}
                              alt={`تصویر ${company.name}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                              <span className="text-4xl mb-2">🖼️</span>
                              <p className="text-sm">تصویر موجود نیست</p>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {company.province}, {company.city}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          معرفی شده توسط: {company.introduced_by.username}
                        </p>
                        <div className="flex items-center justify-end mt-4 space-x-2 space-x-reverse gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveCompany(company.id);
                            }}
                            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                            aria-label={`تایید شرکت ${company.name}`}
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            aria-label={`رد شرکت ${company.name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "approved" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full text-sm text-center">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4">نام شرکت</th>
                      <th className="p-4">استان</th>
                      <th className="p-4">شهر</th>
                      <th className="p-4">معرف</th>
                      <th className="p-4">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedCompanies.map((company) => (
                      <tr key={company.id} className="border-b">
                        <td className="p-4">{company.name}</td>
                        <td className="p-4">{company.province}</td>
                        <td className="p-4">{company.city}</td>
                        <td className="p-4">
                          {company.introduced_by.username || "N/A"}
                        </td>
                        <td className="p-4 flex justify-center items-center space-x-2 space-x-reverse">
                          <button className="text-gray-500 hover:text-red-600" onClick={()=>handleDeleteCompany(company.id)}>
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyManagement;
