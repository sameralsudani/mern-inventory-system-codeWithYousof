import { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Summary = () => {
  const { language } = useLanguage(); // Get the current language from context
  const navigate = useNavigate();

  // Translations object
  const translations = {
    en: {
      dashboard: "Dashboard",
      totalProducts: "Total Products",
      totalStock: "Total Stock",
      ordersToday: "Orders Today",
      revenue: "Revenue",
      outOfStock: "Out of Stock Products",
      noOutOfStock: "No products out of stock.",
      highestSale: "Highest Sale Product",
      name: "Name",
      category: "Category",
      totalUnitsSold: "Total Units Sold",
      loading: "Loading...",
      lowStock: "Low Stock Products",
      noLowStock: "No low stock products.",
      stockLeft: "left",
    },
    ar: {
      dashboard: "لوحة التحكم",
      totalProducts: "إجمالي المنتجات",
      totalStock: "إجمالي المخزون",
      ordersToday: "طلبات اليوم",
      revenue: "الإيرادات",
      outOfStock: "المنتجات غير المتوفرة",
      noOutOfStock: "لا توجد منتجات غير متوفرة.",
      highestSale: "المنتج الأكثر مبيعًا",
      name: "الاسم",
      category: "الفئة",
      totalUnitsSold: "إجمالي الوحدات المباعة",
      loading: "جارٍ التحميل...",
      lowStock: "المنتجات ذات المخزون المنخفض",
      noLowStock: "لا توجد منتجات ذات مخزون منخفض.",
      stockLeft: "متبقي",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        if (!err.response.data.success) {
          navigate("/login");
        }
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t("dashboard")}</h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">{t("totalProducts")}</h2>
          <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">{t("totalStock")}</h2>
          <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">{t("ordersToday")}</h2>
          <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">{t("revenue")}</h2>
          <p className="text-2xl font-bold">${dashboardData.revenue}</p>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Out of Stock Products */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {t("outOfStock")}
          </h3>
          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.outOfStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  {product.name}{" "}
                  <span className="text-gray-400">({product.category.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t("noOutOfStock")}</p>
          )}
        </div>

        {/* Highest Sale Product */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {t("highestSale")}
          </h3>
          {dashboardData.highestSaleProduct?.name ? (
            <div className="text-gray-600">
              <p>
                <strong>{t("name")}:</strong> {dashboardData.highestSaleProduct.name}
              </p>
              <p>
                <strong>{t("category")}:</strong>{" "}
                {dashboardData.highestSaleProduct.category}
              </p>
              <p>
                <strong>{t("totalUnitsSold")}:</strong>{" "}
                {dashboardData.highestSaleProduct.totalQuantity}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">{t("loading")}</p>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {t("lowStock")}
          </h3>
          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.lowStock.map((product, index) => (
                <li key={index} className="text-gray-600">
                  <strong>{product.name}</strong> - {product.stock} {t("stockLeft")}{" "}
                  <span className="text-gray-400">({product.category.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t("noLowStock")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;