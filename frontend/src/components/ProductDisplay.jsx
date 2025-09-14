import PropTypes from 'prop-types';
import ProductItem from './ProductItem';
import { useLanguage } from '../context/LanguageContext'; // If you have a language context

const translations = {
  en: {
    topProducts: "Top products",
  },
  ar: {
    topProducts: "أفضل المنتجات",
  },
};

const ProductDisplay = ({ category, products }) => {
    const { language = "en" } = useLanguage() || {};
    const t = (key) => (translations[language] && translations[language][key]) || key;

  return (
    <div className="food-display" id="food-display">
      <h2 className="text-2xl font-bold mb-6 mt-16">{t("topProducts")}</h2>
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="food-display-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((item) => {
            if (category === "All" || category === item.category.name) {
              return (
                <ProductItem
                  key={item._id}
                  image={item.imageUrl}
                  name={item.name}
                  price={item.price}
                  id={item._id}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

ProductDisplay.propTypes = {
  category: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  })).isRequired,
};

export default ProductDisplay;
