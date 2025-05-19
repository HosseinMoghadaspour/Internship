import React, { useState } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaRegCommentDots,
} from "react-icons/fa";
import Snackbar from "../../components/Snackbar";
import { company } from "../../types/CompanyRegister";

const RegisterCompany = () => {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    province: "",
    city: "",
    description: "",
    introduced_by: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // جلوگیری از اضافه کردن فایل تکراری (بر اساس نام فایل)
      setImages((prev) => {
        const existingNames = prev.map((f) => f.name);
        const newFiles = selectedFiles.filter(
          (f) => !existingNames.includes(f.name)
        );
        return [...prev, ...newFiles];
      });

      // برای اینکه دوباره بشه همون فایل رو آپلود کرد (input reset)
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

      await company(
        formData.name,
        formData.province,
        formData.city,
        formData.description,
        Number(formData.introduced_by),
        images
      );

      setSnackbar({ message: "✅ شرکت با موفقیت ثبت شد!", type: "success" });
      setFormData({
        name: "",
        province: "",
        city: "",
        description: "",
        introduced_by: "",
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      setSnackbar({ message: "❌ خطا در ثبت شرکت.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          فرم ثبت شرکت
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* نام شرکت */}
          <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
            <FaBuilding className="text-blue-500 text-xl ml-2" />
            <input
              type="text"
              placeholder="نام شرکت"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-right"
            />
          </div>

          {/* استان */}
          <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
            <FaMapMarkerAlt className="text-green-500 text-xl ml-2" />
            <input
              type="text"
              placeholder="استان"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-right"
            />
          </div>

          {/* شهر */}
          <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
            <FaCity className="text-purple-500 text-xl ml-2" />
            <input
              type="text"
              placeholder="شهر"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-right"
            />
          </div>

          {/* توضیحات */}
          <div className="flex items-start border border-gray-300 rounded-lg p-3 bg-gray-50">
            <FaRegCommentDots className="text-yellow-500 text-xl ml-2 mt-1" />
            <textarea
              placeholder="توضیحات"
              rows={4}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none resize-none text-right"
            ></textarea>
          </div>

          {/* آپلود عکس شرکت */}
          {/* آپلود عکس شرکت */}
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

            {/* نمایش عکس‌ها */}
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

          {/* دکمه ثبت */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            {loading ? "در حال ثبت..." : "ثبت شرکت"}
          </button>
        </form>
      </div>
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
    </div>
  );
};

export default RegisterCompany;
