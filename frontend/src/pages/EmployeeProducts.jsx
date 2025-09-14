import { useState, useEffect } from "react";
import axiosInstance from "./../utils/api";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook
import ExploreProductList from "../components/ExploreProductList"; // Import ExploreProductList component
import FoodDisplay from "../components/ProductDisplay"; // Import ExploreProductList component

const EmployeeProducts = () => {
  const { language } = useLanguage(); // Get the current language from context

  // Translations object
  const translations = {
    en: {
      products: "Products",
      loading: "Loading...",
      selectCategory: "Select Category",
      searchPlaceholder: "Search products...",
      id: "ID",
      name: "Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      action: "Action",
      order: "Order",
      noProducts: "No products found",
      placeOrder: "Place Order",
      quantity: "Quantity",
      total: "Total",
      cancel: "Cancel",
      notEnoughStock: "Not enough stock",
      orderPlaced: "Order placed successfully!",
      image: "Image",
    },
    ar: {
      products: "المنتجات",
      loading: "جارٍ التحميل...",
      selectCategory: "اختر الفئة",
      searchPlaceholder: "ابحث عن المنتجات...",
      id: "المعرف",
      name: "الاسم",
      category: "الفئة",
      price: "السعر",
      stock: "المخزون",
      action: "الإجراء",
      order: "طلب",
      noProducts: "لم يتم العثور على منتجات",
      placeOrder: "إتمام الطلب",
      quantity: "الكمية",
      total: "الإجمالي",
      cancel: "إلغاء",
      notEnoughStock: "لا يوجد مخزون كافٍ",
      orderPlaced: "تم تقديم الطلب بنجاح!",
      image: "صورة",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch products when category changes
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
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

  const handleFilterProducts = (e) => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleChangeCategory = (e) => {
    setFilteredProducts(
      products.filter((product) => product.category._id === e.target.value)
    );
    setSelectedCategory(e.target.value);
  };

  const handleOrderClick = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      price: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  const IncreaseQuantity = (e) => {
    if (e.target.value > orderData.stock) {
      alert(t("notEnoughStock"));
    } else {
      setOrderData((prev) => ({
        ...prev,
        quantity: parseInt(e.target.value),
        total: parseInt(e.target.value) * parseInt(orderData.price),
      }));
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/order/add", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setIsModalOpen(false);
        setOrderData({ productId: "", quantity: 1, total: 0 });
        fetchProducts();
        alert(t("orderPlaced"));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [category, setCategory] = useState("All");

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("products")}</h1>

        {loading && <p className="text-gray-500 mb-4">{t("loading")}</p>}

        {/* Category Dropdown and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <select
            value={selectedCategory}
            onChange={handleChangeCategory}
            className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            onChange={handleFilterProducts}
            placeholder={t("searchPlaceholder")}
            className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("image")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("id")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("name")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("category")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("price")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("stock")}
                </th>
                <th
                  className={`p-2 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filterProducts.map((product, index) => (
                <tr key={product._id} className="border-t">
                  <td className="p-2">
                    <img
                      src={product.imageUrl || "/images/placeholder.png"}
                      alt={product.name}
                      className={`w-12 h-12 object-cover rounded-full ${
                        language === "ar" ? "mr-0 ml-auto" : "ml-0 mr-auto"
                      }`}
                    />
                  </td>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category.name}</td>
                  <td className="p-2">${product.price}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleOrderClick(product)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                      disabled={loading || product.stock === 0}
                    >
                      {t("order")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filterProducts.length === 0 && !loading && (
            <p className="text-center p-4 text-gray-500">{t("noProducts")}</p>
          )}
        </div>

        <ExploreProductList
          setCategory={setCategory}
          category={category}
          categories={categories}
        />
        <FoodDisplay category={category} products={products} />

        {/* Order Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">{t("placeOrder")}</h2>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("quantity")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={orderData.quantity}
                    onChange={IncreaseQuantity}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <strong>
                    {t("total")}: {orderData.total}
                  </strong>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                    disabled={loading}
                  >
                    {t("placeOrder")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                    disabled={loading}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProducts;
