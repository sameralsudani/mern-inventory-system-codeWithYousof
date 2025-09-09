import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage(); // Get language and setLanguage from context

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-4 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;