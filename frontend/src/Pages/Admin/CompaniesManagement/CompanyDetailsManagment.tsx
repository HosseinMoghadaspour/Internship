import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ApproveCompany } from "../../../types/UpdateCompany";
import Snackbar from "../../../components/Snackbar";

type Company = {
  id: number;
  name: string;
  province: string | null;
  city: string | null;
  address?: string | null;
  description: string | null;
  images: { id: number; image_path: string }[];
  introduced_by: { username: string };
  average_rating?: number;
};

type Props = {
  company: Company;
  onBack: () => void;
};

const CompanyDetailsPageSkeleton: React.FC = () => (
  <div className=" animate-pulse max-w-7xl mx-auto p-4 md:p-8">
    <div className="text-center mb-10 lg:mb-16">
      <div className="h-10 bg-gray-300 rounded-md w-3/5 sm:w-1/2 mx-auto mb-4"></div>
      <div className="h-3 bg-gray-300 rounded-md w-32 md:w-48 mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
      <div className="md:col-span-2 flex flex-col items-center md:items-stretch">
        <div className="w-full aspect-square md:aspect-[4/3] rounded-lg bg-gray-300 mb-6"></div>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 p-3 bg-gray-200 rounded-md">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-gray-300"
            ></div>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200">
        <div className="h-8 bg-gray-300 rounded-md w-1/3 mb-6 pb-4 border-b border-gray-200"></div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="py-1">
              <div className="h-5 bg-gray-300 rounded-md w-1/4 mb-2"></div>
              <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CompanyDetailsManagment: React.FC<Props> = ({ company, onBack }) => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<string | null>(
    company.images?.[0]?.image_path || null
  );
  const [unapprovedCompanies, setUnapprovedCompanies] = useState<Company[]>([]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleApproveCompany = async (companyId: number) => {
    try {
      await ApproveCompany(companyId);
      const companyToMove = unapprovedCompanies.find((c) => c.id === companyId);
      if (companyToMove) {
        setUnapprovedCompanies((prev) =>
          prev.filter((c) => c.id !== companyId)
        );
      }
      setSnackbar({ message: "شرکت با موفقیت تایید شد", type: "success" });
    } catch (err) {
      console.error("خطا در تایید شرکت:", err);
      setSnackbar({
        message: "عملیات تایید شرکت با مشکل مواجه شد.",
        type: "error",
      });
    }
  };

  if (!company) {
    return (
      <div className="bg-gray-100">
        <CompanyDetailsPageSkeleton />
      </div>
    );
  }
  if (!company) {
    return (
      <div className="bg-gray-100">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height,80px))] p-5">
          <svg
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-2xl text-gray-700 mb-6">شرکت پیدا نشد.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100">
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
      <div className="max-w-7xl ">
        <div className="text-center mb-10 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-indigo-700 inline-block">
            {company.name}
          </h1>
          <hr className="mt-4 w-32 md:w-48 mx-auto border-t-4 border-indigo-500 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-2 flex flex-col items-center md:items-stretch">
            {company.images && company.images.length > 0 ? (
              <div className="w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl mb-6 border-2 border-indigo-200 bg-white">
                <img
                  src={`http://localhost:8000/storage/${coverImage}`}
                  alt={`${company.name} cover image`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full aspect-square md:aspect-[4/3] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 shadow-lg mb-6 border border-gray-300">
                <p className="text-lg">تصویری موجود نیست</p>
              </div>
            )}
            {company.images && company.images.length > 1 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3 p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                {company.images.map((img) => (
                  <div
                    key={img.id}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:opacity-80
                        ${
                          coverImage === img.image_path
                            ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50"
                            : "border-gray-300 hover:border-indigo-400"
                        }`}
                    onClick={() => setCoverImage(img.image_path)}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img.image_path}`}
                      alt={`${company.name} thumbnail ${img.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-3 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              اطلاعات شرکت
            </h2>
            <dl className="divide-y divide-gray-100">
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  استان
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.province || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  شهر
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.city || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  آدرس
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.address || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  توضیحات
                </dt>
                <dd className="mt-1 text-md leading-7 text-gray-800 sm:col-span-2 sm:mt-0 whitespace-pre-line">
                  {company.description || (
                    <span className="text-gray-400">—</span>
                  )}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  ثبت شده توسط
                </dt>
                <dd className="flex justify-between mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  <div>
                    {company.introduced_by?.username || (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex items-center justify-end mt-4 space-x-2 space-x-reverse gap-4">
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
    </div>
  );
};

export default CompanyDetailsManagment;