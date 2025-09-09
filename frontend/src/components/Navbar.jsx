import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage from context
import { useAuth } from "../context/AuthContext"; // Import useAuth from context
import LanguageSwitcher from "./LanguageSwitcher"; // Import LanguageSwitcher
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  // Translations for Navbar
  const translations = {
    en: {
      home: "Home",
      about: "About",
      contact: "Contact",
      login: "Login",
    },
    ar: {
      home: "الرئيسية",
      about: "حول",
      contact: "اتصل",
      login: "تسجيل الدخول",
    },
  };

  const { language } = useLanguage(); // Get language from context
  const t = (key) => translations[language][key]; // Translation function

  // Set the `dir` attribute dynamically based on the language
  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-green-700 text-white ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl font-bold">
        {language === "en" ? "Inventory MS" : "نظام إدارة المخزون"}
      </div>

      {/* Login Button and Language Switcher */}
      <div className="flex items-center gap-4">
        {!user && ( // Only show the Login button if the user is not logged in
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            {t("login")}
          </button>
        )}
        <LanguageSwitcher /> {/* Add LanguageSwitcher here */}
      </div>
    </nav>
  );
};

export default Navbar;