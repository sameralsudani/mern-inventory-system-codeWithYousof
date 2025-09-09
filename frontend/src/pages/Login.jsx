import { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage(); // Get language from context

  // Translations object
  const translations = {
    en: {
      title: "Inventory (POS) Management System",
      login: "Login",
      email: "Email",
      password: "Password",
      enterEmail: "Enter Email",
      enterPassword: "Enter Password",
      loggingIn: "Logging in...",
      error: "An error occurred. Please try again.",
      emptyEmail: "Email is required.",
      emptyPassword: "Password is required.",
    },
    ar: {
      title: "نظام إدارة المخزون (نقاط البيع)",
      login: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      enterEmail: "أدخل البريد الإلكتروني",
      enterPassword: "أدخل كلمة المرور",
      loggingIn: "جارٍ تسجيل الدخول...",
      error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      emptyEmail: "البريد الإلكتروني مطلوب.",
      emptyPassword: "كلمة المرور مطلوبة.",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  // Set the page title dynamically
  useEffect(() => {
    document.title = t("title");
  }, [language]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email) {
      setErrorMessage(t("emptyEmail"));
      return;
    }
    if (!password) {
      setErrorMessage(t("emptyPassword"));
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Handle success
      if (response.data.success) {
        await login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setErrorMessage(response.data.error || t("error"));
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(t("error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen justify-center ${
        language === "ar" ? "text-right" : "text-left"
      } bg-gradient-to-b from-green-600 from-50% to-gray-100 to-50% space-y-8`}
    >
      <div className="border shadow-lg p-8 w-full max-w-md bg-white rounded-lg">
        <h2 className="text-3xl font-bold mb-6">{t("login")}</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-lg text-gray-700" htmlFor="email">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmail")}
              aria-label={t("email")}
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg text-gray-700" htmlFor="password">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enterPassword")}
              aria-label={t("password")}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className={`w-full py-3 text-lg rounded-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
              disabled={loading}
            >
              {loading ? t("loggingIn") : t("login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
