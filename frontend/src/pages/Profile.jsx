import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/api";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Profile = () => {
  const { language } = useLanguage(); // Get the current language from context

  // Translations object
  const translations = {
    en: {
      title: "User Profile",
      name: "Name",
      email: "Email",
      address: "Address",
      password: "Password",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Failed to update user information",
      placeholderPassword: "Enter new password (optional)",
    },
    ar: {
      title: "الملف الشخصي",
      name: "الاسم",
      email: "البريد الإلكتروني",
      address: "العنوان",
      password: "كلمة المرور",
      editProfile: "تعديل الملف الشخصي",
      saveChanges: "حفظ التغييرات",
      cancel: "إلغاء",
      loading: "جارٍ التحميل...",
      error: "فشل في تحديث معلومات المستخدم",
      placeholderPassword: "أدخل كلمة مرور جديدة (اختياري)",
    },
  };

  const t = (key) => translations[language]?.[key] || key; // Translation function with fallback

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [originalPassword, setOriginalPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        if (response.data.success) {
          const userInfo = {
            name: response.data.user.name,
            email: response.data.user.email,
            address: response.data.user.address,
            password: "",
          };
          setUserData(userInfo);
          setOriginalPassword(response.data.user.password);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = { ...userData };
    if (updateData.password === "" || updateData.password === originalPassword) {
      delete updateData.password;
    }

    try {
      const response = await axiosInstance.put(`/users/${user.userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });

      if (response.data.success) {
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
          address: response.data.user.address,
          password: "",
        });
        setOriginalPassword(response.data.user.password);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      setError(t("error", err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">{t("loading")}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("name")}
          </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("address")}
          </label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("password")}
            </label>
            <input
              type="password"
              name="password"
              value={userData.password || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("placeholderPassword")}
            />
          </div>
        )}

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
              disabled={loading}
            >
              {t("editProfile")}
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                disabled={loading}
              >
                {t("saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                disabled={loading}
              >
                {t("cancel")}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;