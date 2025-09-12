// src/components/Orders.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage(); // Get the current language from context

  // Translations object
  const translations = {
    en: {
      orders: "Orders",
      myOrders: "My Orders",
      loading: "Loading...",
      noOrders: "No orders found",
      serialNo: "S NO",
      name: "Name",
      address: "Address",
      productName: "Product Name",
      category: "Category",
      quantity: "Quantity",
      totalPrice: "Total Price",
      orderDate: "Order Date",
    },
    ar: {
      orders: "الطلبات",
      myOrders: "طلباتي",
      loading: "جارٍ التحميل...",
      noOrders: "لم يتم العثور على طلبات",
      serialNo: "الرقم",
      name: "الاسم",
      address: "العنوان",
      productName: "اسم المنتج",
      category: "الفئة",
      quantity: "الكمية",
      totalPrice: "السعر الإجمالي",
      orderDate: "تاريخ الطلب",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  // Fetch orders for the user
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/order/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // Refetch if userId changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {user.role === "admin" ? t("orders") : t("myOrders")}
      </h1>

      {loading && <p className="text-gray-500 mb-4">{t("loading")}</p>}

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("serialNo")}
              </th>
              {user.role === "admin" && (
                <>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("name")}
                  </th>
                  <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {t("address")}
                  </th>
                </>
              )}
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("productName")}
              </th>
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("category")}
              </th>
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("quantity")}
              </th>
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("totalPrice")}
              </th>
              <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t("orderDate")}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="border-t">
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {index + 1}
                </td>
                {user.role === "admin" && (
                  <>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {order.user.name}
                    </td>
                    <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {order.user.address}
                    </td>
                  </>
                )}
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {order.product.name}
                </td>
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {order.product.category.name}
                </td>
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {order.quantity}
                </td>
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className={`p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <p className="text-center p-4 text-gray-500">{t("noOrders")}</p>
        )}
      </div>
    </div>
  );
};

export default Orders;