import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Company {
  id: number;
  name: string;
  manager: string;
  email: string;
}

const UnapprovedCompaniesManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: "شرکت دلتا", manager: "علی محمدی", email: "delta@example.com" },
    { id: 2, name: "شرکت زتا", manager: "مریم احمدی", email: "zeta@example.com" },
    { id: 3, name: "شرکت تتا", manager: "حسین کریمی", email: "theta@example.com" },
  ]);

  const [search, setSearch] = useState("");

  const handleApprove = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
    // اینجا می‌تونی درخواست به API تایید ارسال کنی
  };

  const handleReject = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
    // اینجا می‌تونی درخواست به API حذف ارسال کنی
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.includes(search) ||
      company.manager.includes(search) ||
      company.email.includes(search)
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">شرکت‌های در انتظار تایید</h1>

      <input
        type="text"
        placeholder="جستجو..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-right">
              <th className="py-3 px-4 border-b">#</th>
              <th className="py-3 px-4 border-b">نام شرکت</th>
              <th className="py-3 px-4 border-b">مدیر</th>
              <th className="py-3 px-4 border-b">ایمیل</th>
              <th className="py-3 px-4 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company, index) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{company.name}</td>
                <td className="py-3 px-4 border-b">{company.manager}</td>
                <td className="py-3 px-4 border-b">{company.email}</td>
                <td className="py-3 px-4 border-b flex gap-2">
                  <button
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    onClick={() => handleApprove(company.id)}
                  >
                    <CheckCircle size={18} />
                    تایید
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    onClick={() => handleReject(company.id)}
                  >
                    <XCircle size={18} />
                    رد
                  </button>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  شرکتی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnapprovedCompaniesManagement;
