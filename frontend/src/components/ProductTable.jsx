import PropTypes from "prop-types";

const ProductTable = ({
  language,
  t,
  filterProducts,
  loading,
  handleOrderClick,
}) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-[700px] w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("image")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("id")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("name")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("category")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("price")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("stock")}</th>
          <th className={`p-2 ${language === "ar" ? "text-right" : "text-left"} text-xs sm:text-sm`}>{t("action")}</th>
        </tr>
      </thead>
      <tbody>
        {filterProducts.map((product, index) => (
          <tr key={product._id} className="border-t">
            <td className="p-2">
              <img
                src={product.imageUrl || "/images/placeholder.png"}
                alt={product.name}
                className={`w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full ${
                  language === "ar" ? "mr-0 ml-auto" : "ml-0 mr-auto"
                }`}
              />
            </td>
            <td className="p-2 text-xs sm:text-sm">{index + 1}</td>
            <td className="p-2 text-xs sm:text-sm">{product.name}</td>
            <td className="p-2 text-xs sm:text-sm">{product.category.name}</td>
            <td className="p-2 text-xs sm:text-sm">${product.price}</td>
            <td className="p-2 text-xs sm:text-sm">{product.stock}</td>
            <td className="p-2">
              <button
                onClick={() => handleOrderClick(product)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-green-300 text-xs sm:text-sm"
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
);

ProductTable.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  filterProducts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  handleOrderClick: PropTypes.func.isRequired,
};

export default ProductTable;
