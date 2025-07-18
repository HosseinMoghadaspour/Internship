import React, { useState, useEffect } from "react";
import { ListOfCompanies } from "../../../types/ListOfCompanies";
import provinces from "../../../lib/province.json";
import cities from "../../../lib/cities.json";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Footer from "../../../components/Footer";
// =================== TYPES ===================
// تعریف نوع برای یک شرکت
type Company = {
  id: number;
  name: string;
  province: string | null;
  city: string | null;
  description: string | null;
  images: { id: number; image_path: string }[];
  introduced_by: { username: string };
  average_rating: number;
};

type Province = {
  id: number;
  title: string;
};

type City = {
  id: number;
  title: string;
  province_id: number;
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

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
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
);

const CompanySearchPage: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // افکت برای بارگذاری اولیه داده‌های شرکت‌ها
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // در این مثال، فرض می‌کنیم ListOfCompanies داده‌های نمونه را برمی‌گرداند
        const data = await ListOfCompanies();
        setAllCompanies(data);
        setFilteredCompanies(data); // نمایش همه شرکت‌ها در ابتدا
      } catch (err) {
        console.error("خطا در دریافت شرکت‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const provinceData = (provinces as Province[]).find(
        (p) => p.title === selectedProvince
      );

      if (provinceData) {
        const relevantCities = (cities as City[])
          .filter((c) => c.province_id === provinceData.id)
          .map((c) => c.title);
        setAvailableCities(relevantCities);
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
    }
    setSelectedCity("");
  }, [selectedProvince]);

  useEffect(() => {
    let result = allCompanies;

    if (selectedProvince) {
      result = result.filter(
        (company) => company.province === selectedProvince
      );
    }

    if (selectedCity) {
      result = result.filter((company) => company.city === selectedCity);
    }

    setFilteredCompanies(result);
  }, [selectedProvince, selectedCity, allCompanies]);

  const handleResetFilters = () => {
    setSelectedProvince("");
    setSelectedCity("");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white"
    >
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            جستجوی شرکت‌ها
          </h1>
          <p className="text-gray-600 mt-2">
            شرکت مورد نظر خود را بر اساس موقعیت مکانی پیدا کنید.
          </p>
        </header>

        <div className=" rounded-xl mb-10 sticky top-4 z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 items-end">
            <div className="flex flex-col">
              <label
                htmlFor="province"
                className="mb-2 font-semibold text-gray-700"
              >
                استان
              </label>
              <select
                id="province"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition max-w-50"
              >
                <option value="">همه استان‌ها</option>
                {(provinces as Province[]).map((province) => (
                  <option key={province.id} value={province.title}>
                    {province.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="city"
                className="mb-2 font-semibold text-gray-700"
              >
                شهر
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince || availableCities.length === 0}
                className="p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-200 disabled:cursor-not-allowed max-w-50"
              >
                <option value="">همه شهرها</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition h-fit max-w-50"
            >
              حذف فیلترها
            </button>
          </div>
        </div>

        <main>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">در حال بارگذاری...</p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">
                هیچ شرکتی با این مشخصات یافت نشد.
              </p>
            </div>
          )}
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default CompanySearchPage;
