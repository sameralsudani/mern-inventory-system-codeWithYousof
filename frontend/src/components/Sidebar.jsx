import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTable,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext"; // Import useLanguage hook

const Sidebar = () => {
  const { language } = useLanguage(); // Get language from context

  const translations = {
    en: {
      title: "Inventory MS",
      shortTitle: "IMS",
      Dashboard: "Dashboard",
      Products: "Products",
      Categories: "Categories",
      Orders: "Orders",
      Suppliers: "Suppliers",
      Users: "Users",
      Profile: "Profile",
      Logout: "Logout",
    },
    ar: {
      title: "نظام إدارة المخزون",
      shortTitle: "نظام",
      Dashboard: "لوحة القيادة",
      Products: "المنتجات",
      Categories: "الفئات",
      Orders: "الطلبات",
      Suppliers: "الموردون",
      Users: "المستخدمون",
      Profile: "الملف الشخصي",
      Logout: "تسجيل الخروج",
    },
  };

  const t = (key) => translations[language][key]; // Translation function

  const user = JSON.parse(localStorage.getItem("ims_user"));

  const menuItems = [
    { name: t("Dashboard"), path: "/", icon: <FaHome />, isParent: true },
    {
      name: t("Products"),
      path: "/admin-dashboard/products",
      icon: <FaBox />,
      isParent: false,
    },
    {
      name: t("Categories"),
      path: "/admin-dashboard/categories",
      icon: <FaTable />,
      isParent: false,
    },
    {
      name: t("Orders"),
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: t("Suppliers"),
      path: "/admin-dashboard/supplier",
      icon: <FaTruck />,
      isParent: false,
    },
    {
      name: t("Users"),
      path: "/admin-dashboard/users",
      icon: <FaUsers />,
      isParent: false,
    },
    {
      name: t("Profile"),
      path: "/admin-dashboard/profile",
      icon: <FaCog />,
      isParent: true,
    },
    {
      name: t("Logout"),
      path: "/logout",
      icon: <FaSignOutAlt />,
      isParent: true,
    },
  ];

  const userMenuItems = [
    {
      name: t("Products"),
      path: "/employee-dashboard",
      icon: <FaBox />,
      isParent: true,
    },
    {
      name: t("Orders"),
      path: "/employee-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: t("Profile"),
      path: "/employee-dashboard/profile",
      icon: <FaCog />,
      isParent: false,
    },
    {
      name: t("Logout"),
      path: "/logout",
      icon: <FaSignOutAlt />,
      isParent: true,
    },
  ];

  const itemsToRender =
    user && user.role === "admin" ? menuItems : userMenuItems;

  return (
    <div
      className={`fixed h-screen bg-gray-800 text-white w-16 md:w-64 flex flex-col ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {itemsToRender.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.isParent}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-gray-600" : "hover:bg-gray-700"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`${
                    language === "ar" ? "mr-4" : "ml-4"
                  } hidden md:block`}
                >
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
