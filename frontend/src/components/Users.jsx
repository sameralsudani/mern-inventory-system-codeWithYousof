// Users.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Users = () => {
  const { language } = useLanguage(); // Get the current language from context

  // Translations object
  const translations = {
    en: {
      title: "Users Management",
      addUser: "Add New User",
      userName: "User Name",
      userEmail: "User Email",
      password: "Password",
      userAddress: "User Address",
      selectRole: "Select Role",
      admin: "Admin",
      user: "User",
      add: "Add User",
      searchPlaceholder: "Search users...",
      id: "ID",
      name: "Name",
      email: "Email",
      role: "Role",
      action: "Action",
      delete: "Delete",
      noUsers: "No users found",
      loading: "Loading...",
    },
    ar: {
      title: "إدارة المستخدمين",
      addUser: "إضافة مستخدم جديد",
      userName: "اسم المستخدم",
      userEmail: "البريد الإلكتروني للمستخدم",
      password: "كلمة المرور",
      userAddress: "عنوان المستخدم",
      selectRole: "اختر الدور",
      admin: "مشرف",
      user: "مستخدم",
      add: "إضافة مستخدم",
      searchPlaceholder: "ابحث عن المستخدمين...",
      id: "المعرف",
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الدور",
      action: "الإجراء",
      delete: "حذف",
      noUsers: "لم يتم العثور على مستخدمين",
      loading: "جارٍ التحميل...",
    },
  };

  const t = (key) => translations[language]?.[key] || key; // Translation function with fallback

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("ims_token");
      const response = await axiosInstance.post("/users/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        fetchUsers();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSearchInput = (e) => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        setFilteredUsers((prev) =>
          prev.filter((user) => user._id !== id)
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add/Edit Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{t("addUser")}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userName")}
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("userName")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userEmail")}
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t("userEmail")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("password")}
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="*******"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userAddress")}
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder={t("userAddress")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectRole")}</option>
                <option value="admin">{t("admin")}</option>
                <option value="user">{t("user")}</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Table and Search */}
        <div className="lg:w-2/3">
          <div className="mb-4">
            <input
              type="text"
              onChange={handleSearchInput}
              placeholder={t("searchPlaceholder")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("id")}
                  </th>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("name")}
                  </th>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("email")}
                  </th>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("role")}
                  </th>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {index + 1}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {user.name}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {user.email}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {user.role}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"} flex gap-2`}>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 font-bold"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center p-4 text-gray-500">{t("noUsers")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
