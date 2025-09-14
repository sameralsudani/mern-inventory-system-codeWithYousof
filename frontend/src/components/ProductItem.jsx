import { useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

const translations = {
  en: { currency: "$" },
  ar: { currency: "دينار" },
};

const ProductItem = ({ image, name, price,id }) => {
  const { language } = useLanguage();
  const t = (key) => translations[language][key] || key;
  const isRTL = language === "ar";

  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div
      className={`food-item w-80 h-[340px] bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center justify-between mx-auto transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 ${
        isRTL ? "direction-rtl" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="food-item-img-container mb-3 w-full">
        <img
          className="food-item-image w-full h-40 rounded-2xl object-cover border border-gray-300"
          src={image || ""}
          alt={name || ""}
        />
        {cartItems && cartItems[id] && cartItems[id] > 0 ? (
          <div className="food-item-counter flex flex-row items-center gap-3 mt-2 bg-gray-50 rounded-full px-4 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => removeFromCart(id)}
              className="bg-red-100 hover:bg-red-200 rounded-full p-1 transition"
              aria-label="Remove"
            >
              <img src={assets.remove_icon_red} alt="" className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-gray-700">
              {cartItems[id]}
            </span>
            <button
              type="button"
              onClick={() => addToCart(id)}
              className="bg-green-100 hover:bg-green-200 rounded-full p-1 transition"
              aria-label="Add"
            >
              <img src={assets.add_icon_green} alt="" className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(id, )}
            className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition shadow mt-3"
            aria-label="Add to cart"
          >
            <img src={assets.add_icon_white} alt="" className="w-6 h-6" />
          </button>
        )}
      </div>
      <div
        className={`food-item-info w-full ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <p className="text-xl font-semibold text-gray-900 mb-2">{name}</p>
        <p className="food-item-price text-green-700 font-bold text-base bg-green-100 rounded-full px-6 py-2 inline-block shadow-sm">
          {isRTL ? `${price} ${t("currency")}` : `${t("currency")}${price}`}
        </p>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

ProductItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProductItem;
