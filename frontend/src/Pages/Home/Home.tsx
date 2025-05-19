import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { FaComments, FaBuilding, FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Icon from "../../assets/RahAmooz.png";
import InternshipGif from "../../assets/internship.gif";
import { getProfile } from "../../types/GetProfile";
import api from "../../types/api";

type User = {
  id: number;
  username: string;
  img?: string | null;
};

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#c9f7f8] p-12 flex flex-col items-center">
      <Navbar
        UserImg={user?.img ?? ""}
        UserName={user?.username ?? ""}
        isLoading={isLoading}
      />

      <div className="flex items-center gap-5">
        <div className="max-w-4xl w-full text-center">
          <img src={Icon} alt="Icon" className="w-40 h-40 mx-auto mb-4" />
          <p className="mt-4 text-lg text-gray-700">
            جایی برای اشتراک تجربه‌های کارآموزی، امتیازدهی به شرکت‌ها و ارتباط
            با دیگر دانشجویان
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3 text-center">
            <FeatureCard
              icon={<FaBuilding className="text-blue-600 text-3xl" />}
              title="ثبت تجربه کارآموزی"
              description="نام شرکت، محل، و تجربه‌ات رو ثبت کن تا دیگران استفاده کنن."
            />
            <FeatureCard
              icon={<FaStar className="text-yellow-500 text-3xl" />}
              title="امتیاز و نظر"
              description="به شرکت‌ها امتیاز بده و نظرت رو با بقیه به اشتراک بذار."
            />
            <FeatureCard
              icon={<FaComments className="text-green-500 text-3xl" />}
              title="گفتگو با دیگران"
              description="با دانشجوهای دیگه در چت خصوصی صحبت کن و راهنمایی بگیر."
            />
          </div>

          <div className="flex justify-center mt-16 min-w-[200px] items-center">
            <img
              src={InternshipGif}
              alt="Internship illustration"
              className="w-[500px] h-auto items-center"
            />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button />
            <Button />
          </div>
        </div>
      </div>
    </main>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center border border-gray-200 hover:shadow-xl transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-blue-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default HomePage;
