import { useLanguage } from "../context/LanguageContext"; // Import useLanguage from context
import { useAuth } from "../context/AuthContext"; // Import useAuth from context
import LanguageSwitcher from "./LanguageSwitcher"; // Import LanguageSwitcher
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTotalCartAmount } = useContext(StoreContext);
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
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr"
    );
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
        <Link to="/cart" className="navbar-search-icon relative">
          <svg
            className="w-8 h-8"
            fill="white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 14l.84-2h7.58a1 1 0 0 0 .96-.74l2.25-8A1 1 0 0 0 18.25 2H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 6 14h12v-2H7.42z" />
          </svg>
          {getTotalCartAmount()> 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </Link>
        <LanguageSwitcher /> {/* Add LanguageSwitcher here */}
      </div>
    </nav>
  );
};

export default Navbar;
