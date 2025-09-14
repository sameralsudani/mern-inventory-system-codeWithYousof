import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext"; // If you have a language context

const translations = {
  en: {
    exploreTitle: "Explore our products list",
    exploreText:
      "Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.",
  },
  ar: {
    exploreTitle: "استكشف قائمة منتجاتنا",
    exploreText:
      "اختر من قائمة متنوعة تضم مجموعة شهية من الأطباق. مهمتنا هي إرضاء رغباتك وتعزيز تجربتك في تناول الطعام، وجبة لذيذة في كل مرة.",
  },
};

const ExploreProductList = ({ category: selectedCategory, setCategory, categories }) => {
  const { language } = useLanguage();
  const t = (key) => translations[language][key] || key;

  return (
    <div className='explore-menu mt-16' id='explore-menu'>
      <h1 className="text-2xl font-extrabold mb-4">{t("exploreTitle")}</h1>
      <p className='explore-menu-text'>{t("exploreText")}</p>
      <div className="mt-8 explore-menu-list flex flex-row gap-12 overflow-x-auto py-4 px-2">
        {categories.map((category, index) => (
          <div
            onClick={() =>
              setCategory((prev) =>
                prev === category.name ? "All" : category.name
              )
            }
            key={index}
            className="explore-menu-list-item flex flex-col items-center cursor-pointer"
          >
            <img
              src={category.imageUrl || ""}
              className={`w-32 h-32 rounded-full object-cover transition-all duration-200 ${
                selectedCategory === category.name
                  ? "ring-4 ring-green-500 shadow-lg"
                  : "ring-0"
              }`}
              alt={category.name || ""}
            />
            <p className="mt-3 text-xl font-bold">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ExploreProductList.propTypes = {
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      imageUrl: PropTypes.string,
    }),
  ]),
  setCategory: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
};

export default ExploreProductList;
