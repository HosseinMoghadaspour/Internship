import React from "react";
import Logo from "../assets/icon.png"; // مسیر لوگو باید صحیح باشد

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white w-full py-10 px-6 sm:px-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-6">
        {/* بخش لوگو و اطلاعات شرکت */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-800 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden shadow-md">
            <img src={Logo} alt="راه‌آموز" className="w-full h-full object-contain" />
          </div>
          <div className="pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-teal-400">راه آموز</h2>
            <p className="text-sm text-gray-300 mt-1">سایت ثبت شرکت کارآموزی</p>
            <p className="text-xs text-gray-400 mt-3">
              © 2025 کلیه حقوق محفوظ است
            </p>
          </div>
        </div>

        {/* بخش لینک‌های ناوبری */}
        <div className="flex flex-col items-start md:items-center gap-y-4 md:flex-row md:gap-x-8 text-sm mt-6 md:mt-0 md:pt-2">
          <a
            href="#"
            className="hover:text-teal-400 transition-colors duration-300 ease-in-out"
          >
            درباره ما
          </a>
          <a
            href="#"
            className="hover:text-teal-400 transition-colors duration-300 ease-in-out"
          >
            فرصت‌های کارآموزی
          </a>
          <a
            href="#"
            className="hover:text-teal-400 transition-colors duration-300 ease-in-out"
          >
            تماس با ما
          </a>
        </div>

        {/* بخش طراح */}
        <div className="text-xs text-gray-500 mt-6 md:mt-0 md:pt-10 text-left md:text-right w-full md:w-auto">
          <p>طراحی شده توسط</p>
          <p className="font-semibold text-gray-400">حسین مقدس پور</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;