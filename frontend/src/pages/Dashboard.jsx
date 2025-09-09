import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const AdminDashboard = () => {
  const { language } = useLanguage(); // Get the current language

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div
          className={`flex-1 ${
            language === "ar" ? "mr-16 md:mr-64" : "ml-16 md:ml-64"
          } bg-gray-100 h-screen`} // Dynamically adjust margin
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
