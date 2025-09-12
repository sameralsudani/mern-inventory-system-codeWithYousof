// Categories.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Categories = () => {
  const { language } = useLanguage(); // Get the current language from context

  // Translations object
  const translations = {
    en: {
      title: "Category Management",
      addCategory: "Add New Category",
      editCategory: "Edit Category",
      categoryName: "Category Name",
      description: "Description",
      enterCategoryName: "Enter category name",
      categoryDescription: "Category description (optional)",
      saveChanges: "Save Changes",
      add: "Add Category",
      cancel: "Cancel",
      searchPlaceholder: "Search categories...",
      id: "ID",
      name: "Name",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      noCategories: "No categories found",
      loading: "Loading...",
    },
    ar: {
      title: "إدارة الفئات",
      addCategory: "إضافة فئة جديدة",
      editCategory: "تعديل الفئة",
      categoryName: "اسم الفئة",
      description: "الوصف",
      enterCategoryName: "أدخل اسم الفئة",
      categoryDescription: "وصف الفئة (اختياري)",
      saveChanges: "حفظ التغييرات",
      add: "إضافة الفئة",
      cancel: "إلغاء",
      searchPlaceholder: "ابحث عن الفئات...",
      id: "المعرف",
      name: "الاسم",
      actions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      noCategories: "لا توجد فئات",
      loading: "جارٍ التحميل...",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formCategory.trim()) return;

    setLoading(true);
    if (editingId) {
      try {
        const response = await axiosInstance.put(
          `/category/${editingId}`,
          { formCategory, formDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
            },
          }
        );
        if (response.data.success) {
          fetchCategories();
        }
        setEditingId(null);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Add new category
      try {
        const token = localStorage.getItem("ims_token");
        const response = await axiosInstance.post(
          "/category/add",
          { formCategory, formDescription },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          fetchCategories();
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    setFormCategory("");
    setFormDescription("");
  };

  const handleSearchInput = (e) => {
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories((prev) =>
          prev.filter((category) => category._id !== id)
        );
        setFilteredCategories((prev) =>
          prev.filter((category) => category._id !== id)
        );
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormCategory(category.name);
    setFormDescription(category.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormCategory("");
    setFormDescription("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-500">{t("loading")}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add/Edit Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? t("editCategory") : t("addCategory")}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("categoryName")}
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder={t("enterCategoryName")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("description")}
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t("categoryDescription")}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 ${
                    editingId
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-md`}
                >
                  {editingId ? t("saveChanges") : t("add")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    {t("cancel")}
                  </button>
                )}
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
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={index} className="border-t">
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {index + 1}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {category.name}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"} flex gap-2`}>
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        disabled={editingId === category._id}
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && (
              <p className="text-center p-4 text-gray-500">{t("noCategories")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;