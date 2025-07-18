import React, { useEffect, useState } from "react";
import { ListOfCompanies } from "../../../types/ListOfCompanies";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Footer from "../../../components/Footer";

type Company = {
  id: number;
  name: string;
  province: string | null;
  city: string | null;
  description: string | null;
  images: { id: number; image_path: string }[];
  introduced_by: { username: string };
  average_rating?: number;
};

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 18 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center" dir="ltr">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient
            id="star-gradient-list"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} size={size} fill="url(#star-gradient-list)" />
      ))}
      {halfStar && (
        <FaStar
          key="half"
          size={size}
          fill="url(#star-gradient-list)"
          style={{ opacity: 0.65 }}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} size={size} color="#e0e0e0" />
      ))}
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
    <div className="w-full h-48 sm:h-56 bg-gray-300" />
    <div className="p-5 flex-grow flex flex-col">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-5 bg-gray-300 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-4" />
      <div className="mt-auto space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
          <div className="h-3 bg-gray-300 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await ListOfCompanies();
        console.log(data); 
        setCompanies(data);
      } catch (err) {
        console.error("خطا در دریافت شرکت‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col">
      <Navbar />
      <div className="text-center mt-8 mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 inline-block pb-2">
          لیست شرکت‌ها
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          آخرین شرکت‌های ثبت شده برای کارآموزی را مشاهده کنید.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 min-h-[60vh]">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="min-h-[355px] text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-800">
            هیچ شرکتی یافت نشد
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            به نظر می‌رسد هنوز شرکتی ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-10 p-3">
          {companies.map((company) => (
            <Link
              to={`/company/${company.id}`}
              key={company.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col"
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

              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-800 transition-colors duration-300 mb-1 truncate">
                  {company.name}
                </h2>

                {company.average_rating !== undefined && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={company.average_rating} />
                    <span className="text-sm font-bold text-gray-600">
                      ({company.average_rating.toFixed(1)})
                    </span>
                  </div>
                )}

                {company.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="mt-auto border-t pt-3">
                  <div className="space-y-2 text-xs text-gray-500 mb-3">
                    <p className="flex items-center">
                      <span className="ml-2">📍</span>
                      استان:{" "}
                      <span className="font-medium text-gray-700 mr-1">
                        {company.province || "ثبت نشده"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="ml-2">🏙️</span>
                      شهر:{" "}
                      <span className="font-medium text-gray-700 mr-1">
                        {company.city || "ثبت نشده"}
                      </span>
                    </p>
                  </div>
                  <div className="pt-3 mt-3 flex justify-between items-center text-xs text-gray-500">
                    <p className="flex items-center">
                      <span className="ml-1">👤</span>
                      ثبت توسط:{" "}
                      <span className="font-semibold text-gray-700 mr-1">
                        {company.introduced_by.username || "نامشخص"}
                      </span>
                    </p>
                    <span className="text-indigo-500 group-hover:translate-x-1 transition-transform duration-300 ease-in-out rtl:group-hover:-translate-x-1">
                      مشاهده جزئیات &larr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CompanyList;
