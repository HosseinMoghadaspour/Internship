import React, { useState } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaRegCommentDots,
} from "react-icons/fa";
import Snackbar from "../../../components/Snackbar";
import { company } from "../../../types/CompanyRegister";
import { useLocation, useNavigate } from "react-router-dom";
import company_logo from "../../../assets/Company.gif";
import Icon from "../../../assets/RahAmooz.png";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import provinces from "../../../lib/province.json";
import citiesData from "../../../lib/cities.json";

interface Province {
  id: number;
  title: string;
}

interface City {
  id: number;
  title: string;
  province_id: number;
}

const RegisterCompany = () => {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    province: "",
    city: "",
    address: "",
    description: "",
    introduced_by: id,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const province = provinces.find((p) => p.id.toString() === provinceId);

    setSelectedProvinceId(provinceId);
    setFormData((prev) => ({
      ...prev,
      province: province ? province.title : "",
      city: "", 
    }));

    if (provinceId) {
      const relatedCities = (citiesData as City[]).filter(
        (city) => city.province_id.toString() === provinceId
      );
      setFilteredCities(relatedCities);
    } else {
      setFilteredCities([]); 
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      setImages((prev) => {
        const existingNames = prev.map((f) => f.name);
        const newFiles = selectedFiles.filter(
          (f) => !existingNames.includes(f.name)
        );
        return [...prev, ...newFiles];
      });
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      images.forEach((file) => {
        form.append("images[]", file);
      });

      setFormData({
        name: "",
        province: "",
        city: "",
        description: "",
        introduced_by: id,
        address: "",
      });
      await company(
        formData.name,
        formData.province,
        formData.city,
        formData.description,
        formData.introduced_by,
        formData.address,
        images
      );

      setSnackbar({ message: "✅ شرکت با موفقیت ثبت شد!", type: "success" });
      setImages([]);
      navigate("/");
    } catch (err) {
      console.error(err);
      setSnackbar({ message: "❌ خطا در ثبت شرکت.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col">
      <Navbar />
      <img src={Icon} alt="Icon" className="w-40 h-40 mx-auto mb-4" />
      <div className="flex items-center justify-center p-4 gap-8 mb-6">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            فرم ثبت شرکت کارآموزی
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FaBuilding className="text-blue-500 text-xl ml-2" />
              <input
                type="text"
                name="name"
                placeholder="نام شرکت"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none text-right"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FaMapMarkerAlt className="text-green-500 text-xl ml-2" />
              <select
                name="province"
                value={selectedProvinceId}
                onChange={handleProvinceChange}
                className="w-full bg-transparent focus:outline-none text-right"
              >
                <option value="">استان را انتخاب کنید</option>
                {(provinces as Province[]).map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FaCity className="text-purple-500 text-xl ml-2" />
              <select
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                className="w-full bg-transparent focus:outline-none text-right"
                disabled={!selectedProvinceId}
              >
                <option value="">شهر را انتخاب کنید</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.title}>
                    {city.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FaCity className="text-purple-500 text-xl ml-2" />
              <input
                type="text"
                name="address"
                placeholder="آدرس"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none text-right"
              />
            </div>

            <div className="flex items-start border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FaRegCommentDots className="text-yellow-500 text-xl ml-2 mt-1" />
              <textarea
                name="description"
                placeholder="توضیحات"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none resize-none text-right"
              ></textarea>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center">
              <label className="cursor-pointer text-blue-600 font-semibold block mb-2">
                انتخاب عکس‌های شرکت
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border shadow"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`img-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImages((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        title="حذف عکس"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
            >
              {loading ? "در حال ثبت..." : "ثبت شرکت"}
            </button>
          </form>
        </div>
        <div>
          <img src={company_logo} alt="" className="mx-auto mb-4" />
        </div>
      </div>
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
      <Footer />
    </div>
  );
};

export default RegisterCompany;
