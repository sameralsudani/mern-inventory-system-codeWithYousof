import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const AdminDashboard = () => {
  const { language } = useLanguage();

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div
          className={`flex-1 ${
            language === "ar" ? "mr-16 md:mr-64" : "ml-16 md:ml-64"
          } bg-gray-100 h-screen overflow-x-hidden`} // Prevent horizontal scrollbar
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
