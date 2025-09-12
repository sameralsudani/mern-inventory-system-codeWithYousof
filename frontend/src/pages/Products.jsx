import { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook
import AddProductForm from "../components/forms/AddProductForm";
import EditProductForm from "../components/forms/EditProductForm";

const Products = () => {
  const { language } = useLanguage(); // Get language from context
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // Translation object
  const translations = {
    en: {
      title: "Products",
      searchPlaceholder: "Search products by name...",
      addProduct: "Add Product",
      name: "Name",
      description: "Description",
      price: "Price",
      stock: "Stock",
      category: "Category",
      supplier: "Supplier",
      action: "Action",
      edit: "Edit",
      delete: "Delete",
      noProducts: "No products found.",
      addNewProduct: "Add New Product",
      editProduct: "Edit Product",
      cancel: "Cancel",
      updateProduct: "Update Product",
      uploadImage: "Upload image",
      image: "Image",
    },
    ar: {
      title: "المنتجات",
      searchPlaceholder: "ابحث عن المنتجات بالاسم...",
      addProduct: "إضافة منتج",
      name: "الاسم",
      description: "الوصف",
      price: "السعر",
      stock: "المخزون",
      category: "الفئة",
      supplier: "المورد",
      action: "الإجراء",
      edit: "تعديل",
      delete: "حذف",
      noProducts: "لم يتم العثور على منتجات.",
      addNewProduct: "إضافة منتج جديد",
      editProduct: "تعديل المنتج",
      cancel: "إلغاء",
      updateProduct: "تحديث المنتج",
      uploadImage: "رفع صورة",
      image: "صورة",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  useEffect(() => {
    const html = document.documentElement;
    if (language === "ar") {
      html.setAttribute("dir", "rtl");
    } else {
      html.setAttribute("dir", "ltr");
    }
  }, [language]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setCategories(response.data.categories || []);
        setSuppliers(response.data.suppliers || []);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchInput = (e) => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setProducts((prev) => prev.filter((supplier) => supplier._id !== id));
        setFilteredProducts((prev) =>
          prev.filter((product) => product._id !== id)
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading ....</div>;
  }

  return (
    <div
      className={`p-6 ${
        language === "ar" ? "text-right" : "text-left"
      }`} /* Dynamically apply text alignment */
    >
      {/* Search and Add Product Button */}
      <div
        className={`mb-6 flex flex-col sm:flex-row gap-4 ${
          language === "ar" ? "text-right" : "text-left"
        }`} /* Dynamically align content */
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          onChange={handleSearchInput}
          className="w-full sm:flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t("addProduct")}
        </button>
      </div>

      {/* Products Table */}
      <div
        className={`bg-white shadow-md rounded-lg overflow-hidden ${
          language === "ar" ? "text-right" : "text-left"
        }`} /* Dynamically align table */
      >
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("image") || "Image"}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("name")}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("category")}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("supplier")}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("price")}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("stock")}
              </th>
              <th
                className={`px-4 py-2 ${
                  language === "ar" ? "text-right" : "text-left"
                } text-gray-600 font-semibold`}
              >
                {t("action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <img
                      src={product.imageUrl || "/images/placeholder.png"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    } text-gray-800`}
                  >
                    {product.name}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    } text-gray-600`}
                  >
                    {product.category.name}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    } text-gray-600`}
                  >
                    {product.supplier.name}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    } text-gray-600`}
                  >
                    ${product.price.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : product.stock <= 5
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2 flex gap-2 ${"justify-start"}`} /* Dynamically align buttons */
                  >
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className={`px-4 py-2 text-center ${
                    language === "ar" ? "text-right" : "text-left"
                  } text-gray-500`}
                >
                  {t("noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("addNewProduct")}
            </h2>
            <AddProductForm
              onClose={() => {
                setIsAddModalOpen(false);
                setEditingId(null);
              }}
              categories={categories}
              suppliers={suppliers}
            />
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("editProduct")}
            </h2>
            <EditProductForm
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingId(null);
              }}
              categories={categories}
              suppliers={suppliers}
              product={
                editingId ? products.find((p) => p._id === editingId) : null
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
