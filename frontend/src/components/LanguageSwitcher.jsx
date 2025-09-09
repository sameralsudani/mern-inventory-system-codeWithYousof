import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage(); // Get language and setLanguage from context

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 rounded ${
          language === "en" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage("ar")}
        className={`px-4 py-2 rounded ${
          language === "ar" ? "bg-green-500 text-white" : "bg-gray-300"
        }`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;