import { Routes, Route } from "react-router-dom";
import Home from "../src/Pages/Home/Home";
import LoginForm from "../src/Pages/Login&SignIn/LoginForm";
import SignIn from "../src/Pages/Login&SignIn/SignIn";
import CompanyRegister from "../src/Pages/Company/CompanyRegister";
function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignIn />} />
      <Route path="/companyRegister" element={<CompanyRegister />} />
    </Routes>
  );
}

export default RoutesPage;
