import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: { currency: "$" },
  ar: { currency: "دينار" },
};

const ProductItem = ({ image, name, price, desc }) => {
  const { language } = useLanguage();
  const t = (key) => translations[language][key] || key;
  const isRTL = language === "ar";

  return (
    <div
      className={`food-item bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center max-w-sm mx-auto transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 ${
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
      </div>
      <div className={`food-item-info w-full ${isRTL ? "text-right" : "text-left"}`}>
        <p className="text-xl font-semibold text-gray-900 mb-2">{name}</p>
        <p className="food-item-desc text-gray-500 text-base mb-4">{desc}</p>
        <p className="food-item-price text-green-700 font-bold text-base bg-green-100 rounded-full px-6 py-2 inline-block shadow-sm">
          {isRTL ? `${price} ${t("currency")}` : `${t("currency")}${price}`}
        </p>
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

ProductItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  desc: PropTypes.string,
};

export default ProductItem;
