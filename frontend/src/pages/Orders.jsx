import { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// Local translation object
const translations = {
  en: {
    myOrders: "My Orders",
    noOrders: "No orders found.",
    number: "#",
    icon: "Icon",
    items: "Items",
    amount: "Amount",
    totalItems: "Total Items",
    date: "Date",
    switchLang: "العربية",
  },
  ar: {
    myOrders: "طلباتي",
    noOrders: "لا توجد طلبات.",
    number: "رقم",
    icon: "أيقونة",
    items: "العناصر",
    amount: "المبلغ",
    totalItems: "عدد العناصر",
    date: "التاريخ",
    switchLang: "English",
  },
};

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { language } = useLanguage();
  const t = (key) => translations[language][key] || key;

  const { user } = useAuth();
  const { currency } = useContext(StoreContext);
  const token = localStorage.getItem("ims_token");

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/order/" + user.userId, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.orders || response.data.data || []);
    } catch {
      setData([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, user?.userId]);

  return (
    <div
      className={`my-orders bg-gray-50 min-h-screen py-8 px-2 sm:px-8 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className={`text-2xl font-bold text-black-200 mb-8 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {t("myOrders")}
      </h2>
      <div className="container max-w-4xl">
        {data?.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            {t("noOrders")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200 text-left">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="p-3 font-semibold">{t("number")}</th>
                  <th className="p-3 font-semibold">{t("icon")}</th>
                  <th className="p-3 font-semibold">{t("items")}</th>
                  <th className="p-3 font-semibold">{t("amount")}</th>
                  <th className="p-3 font-semibold">{t("totalItems")}</th>
                  <th className="p-3 font-semibold">{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, index) => (
                  <tr
                    key={order._id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 align-top">{index + 1}</td>
                    <td className="p-3 align-top">
                      <img
                        src={assets.parcel_icon}
                        alt=""
                        className="w-8 h-8 object-contain rounded-full border border-green-200 bg-green-50"
                      />
                    </td>
                    <td className="p-3 text-gray-700">
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-bold text-green-700 align-top">
                      {currency}
                      {order.amount}.00
                    </td>
                    <td className="p-3 text-gray-600 align-top">
                      {order.items.length}
                    </td>
                    <td className="p-3 text-gray-600 align-top">
                      {new Date(order.date).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
