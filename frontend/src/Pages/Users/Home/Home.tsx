import React, { useEffect, useState } from "react";
import { FaComments, FaBuilding, FaRobot } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import Icon from "../../../assets/RahAmooz.png";
import InternshipGif from "../../../assets/internship.gif";
import { getProfile } from "../../../types/GetProfile";
import api from "../../../types/api";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { LuTableOfContents } from "react-icons/lu";

type User = {
  id: number;
  username: string;
  img?: string | null;
};

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isMobile, setIsMobile] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleCompanyRegister = () => {
    navigate("/companyRegister", {
      state: { id: user?.id, username: user?.username, img: user?.img },
    });
  };

  const handleListOfCompany = () => {
    navigate("/listOfCompanies", {
      state: { username: user?.username, img: user?.img },
    });
  };

  const handleAiChat = () => {
    navigate("/AiChat");
  };

  const handleChatPage = () => {
    navigate("/chat");
  };

  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const data = await getProfile();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center">
      <Navbar isLoading={isLoading} />

      <div className="flex items-center gap-5 p-5">
        <div className="max-w-4xl w-full text-center">
          <img src={Icon} alt="Icon" className="w-40 h-40 mx-auto mb-4" />
          <p className="mt-4 text-lg text-gray-700">
            جایی برای اشتراک تجربه‌های کارآموزی، امتیازدهی به شرکت‌ها و ارتباط
            با دیگر دانشجویان
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-1 text-center w-[80%] mx-auto">
            <button onClick={handleCompanyRegister}>
              <FeatureCard
                icon={<FaBuilding className="text-blue-600 text-3xl" />}
                title="ثبت تجربه کارآموزی"
                description="نام شرکت، محل، و تجربه‌ات رو ثبت کن تا دیگران استفاده کنن."
              />
            </button>
            <button onClick={handleChatPage}>
              <FeatureCard
                icon={<FaComments className="text-yellow-500 text-3xl" />}
                title="گفتگو با دیگران"
                description="با دانشجوهای دیگه در چت خصوصی صحبت کن و راهنمایی بگیر."
              />
            </button>
            <button onClick={handleListOfCompany}>
              <FeatureCard
                icon={<LuTableOfContents className="text-red-500 text-3xl" />}
                title="لیست تمام شرکت ها"
                description="تمام شرکت هایی که کارآموز می‌پذیرند"
              />
            </button>
            <button onClick={handleAiChat}>
              <FeatureCard
                icon={<FaRobot className="text-green-500 text-3xl" />}
                title="هوش مصنوعی"
                description="هر سوالی داری ازش بپرس"
              />
            </button>
          </div>
        </div>
        {!isMobile && (
          <div className="flex justify-center min-w-[200px] items-center">
            <img
              src={InternshipGif}
              alt="Internship illustration"
              className="w-[800px] h-auto items-center"
            />
          </div>
        )}
      </div>
      <Footer />
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
