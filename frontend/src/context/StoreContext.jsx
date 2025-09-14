import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../utils/api";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:3000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "$";
  const deliveryCharge = 5;

  const addToCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("ims_user"));
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    await axiosInstance.post(
      "/cart/add",
      { itemId, userId: user.userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      }
    );
  };

  const removeFromCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("ims_user"));

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    await axiosInstance.post(
      "/cart/remove",
      { itemId, userId: user.userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      }
    );
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          totalAmount += itemInfo.price * cartItems[item];
        }
      } catch (error) {
        console.error(error);
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axiosInstance.get("/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
      },
    });
    setFoodList(response.data.products);
  };

  const loadCartData = async () => {
    const response = await axiosInstance.post(
      "/cart/get",
      {
        userId: JSON.parse(localStorage.getItem("ims_user"))?.userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData();
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
