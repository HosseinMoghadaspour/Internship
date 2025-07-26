import { Routes, Route } from "react-router-dom";
import Home from "../src/Pages/Users/Home/Home";
import LoginForm from "../src/Pages/Common/Login&SignIn/LoginForm";
import SignIn from "../src/Pages/Common/Login&SignIn/SignIn";
import CompanyRegister from "../src/Pages/Users/Company/CompanyRegister";
import CompanyList from "../src/Pages/Users/Company/ListOfCompanies";
import CompanyDetails from "../src/Pages/Users/Company/CompanyDetails";
import AIRouteTest from "../src/Pages/Common/AI/AI";
import ChatPage from "../src/Pages/Users/Chat/ChatPage";
import AdminHome from "../src/Pages/Admin/Home/AdminHome";
import ProfilePage from "../src/Pages/Common/Profile/Profile";
import AdminProtectedRoute from "./Check";
import SearchPage from "../src/Pages/Users/Search/SearchPage";

function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignIn />} />
      <Route path="/companyRegister" element={<CompanyRegister />} />
      <Route path="/listOfCompanies" element={<CompanyList />} />
      <Route path="/company/:id" element={<CompanyDetails />} />
      <Route path="/AiChat" element={<AIRouteTest />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:username" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminHome />} />
      </Route>
    </Routes>
  );
}

export default RoutesPage;
