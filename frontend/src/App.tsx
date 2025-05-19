import { BrowserRouter } from "react-router-dom";
import RoutesPage from "../Routes/Routes";
import "./App.css";
import api from "./types/api";

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  console.log(token)
}
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="main">
          <RoutesPage />
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
