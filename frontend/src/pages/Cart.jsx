import { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import Invoice from "../components/Invoice";
import { useLanguage } from "../context/LanguageContext";
import axiosInstance from "./../utils/api";
import toast from "react-hot-toast";

// Simple local translation object
const translations = {
  en: {
    items: "Items",
    title: "Title",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    remove: "Remove",
    removeItem: "Remove item",
    cartEmpty: "Your cart is empty.",
    cartTotals: "Cart Totals",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    proceedToCheckout: "PROCEED TO CHECKOUT",
    switchLang: "العربية",
  },
  ar: {
    items: "العناصر",
    title: "العنوان",
    price: "السعر",
    quantity: "الكمية",
    total: "الإجمالي",
    remove: "إزالة",
    removeItem: "إزالة العنصر",
    cartEmpty: "سلة التسوق فارغة.",
    cartTotals: "إجمالي السلة",
    subtotal: "المجموع الفرعي",
    deliveryFee: "رسوم التوصيل",
    proceedToCheckout: "المتابعة للدفع",
    switchLang: "English",
  },
};

const Cart = () => {
  const { language } = useLanguage();
  const t = (key) => translations[language][key] || key;

  const [orderInfo, setOrderInfo] = useState();
  const [showInvoice, setShowInvoice] = useState(false);

  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    currency,
    deliveryCharge,
    setCartItems,
  } = useContext(StoreContext);

  const placeOrder = async () => {
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      userId: JSON.parse(localStorage.getItem("ims_user")).userId,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryCharge,
    };

    let response = await axiosInstance.post("/order/place-order", orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
      },
    });
    if (response.data.success) {
      setOrderInfo(response.data.order);
      setShowInvoice(true);
      toast.success(response.data.message);
      setCartItems({});
    } else {
      toast.error("Something Went Wrong");
    }
  };
  return (
    <div className="cart bg-gray-50 min-h-screen py-8 px-2 sm:px-8">
      <div className="max-w-5xl ml-0">
        <div className="cart-items bg-white rounded-xl shadow-md p-4 mb-8 overflow-x-auto">
          <div className="cart-items-title grid grid-cols-6 gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
            <p>{t("items")}</p>
            <p>{t("title")}</p>
            <p>{t("price")}</p>
            <p>{t("quantity")}</p>
            <p>{t("total")}</p>
            <p>{t("remove")}</p>
          </div>
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div
                  key={index}
                  className={`cart-items-item grid grid-cols-6 gap-4 items-center py-2 border-b ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <p className="truncate">{item.name}</p>
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <div>{cartItems[item._id]}</div>
                  <p className="font-bold">
                    {currency}
                    {item.price * cartItems[item._id]}
                  </p>
                  <button
                    className={`cart-items-remove-icon text-red-500 font-bold text-lg hover:text-red-700 transition ${
                      language === "ar"
                        ? "justify-self-start"
                        : "justify-self-start"
                    }`}
                    onClick={() => removeFromCart(item._id)}
                    aria-label={t("removeItem")}
                  >
                    ×
                  </button>
                </div>
              );
            }
            return null;
          })}
          {Object.values(cartItems).every((qty) => qty === 0) && (
            <div className="text-center py-8 text-gray-400">
              {t("cartEmpty")}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg ml-0">
        <div className="cart-bottom flex flex-col md:flex-row gap-8">
          <div className="cart-total bg-white rounded-xl shadow-md p-6 flex-1 mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              {t("cartTotals")}
            </h2>
            <div>
              <div className="cart-total-details flex justify-between py-2">
                <p>{t("subtotal")}</p>
                <p>
                  {currency}
                  {getTotalCartAmount()}
                </p>
              </div>
              <hr />
              <div className="cart-total-details flex justify-between py-2">
                <p>{t("deliveryFee")}</p>
                <p>
                  {currency}
                  {getTotalCartAmount() === 0 ? 0 : deliveryCharge}
                </p>
              </div>
              <hr />
              <div className="cart-total-details flex justify-between py-2 font-bold">
                <b>{t("total")}</b>
                <b>
                  {currency}
                  {getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + deliveryCharge}
                </b>
              </div>
            </div>
            <button
              onClick={() => placeOrder()}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              disabled={getTotalCartAmount() === 0}
            >
              {t("proceedToCheckout")}
            </button>
          </div>
        </div>
      </div>
      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </div>
  );
};

export default Cart;
