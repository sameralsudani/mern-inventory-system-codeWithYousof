import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// Route to add a new employee
const addOrder = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const userId = req.user._id;
    const product = await Product.findById({ _id: productId });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ error: "Not enough stock" });
    } else {
      product.stock -= parseInt(quantity);
      await product.save();
    }

    // const totalPrice = product.price * quantity;
    const order = new Order({
      user: userId,
      product: productId,
      quantity,
      totalPrice: total,
    });
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created successfully" });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });
    const order = await newOrder.save();
    await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    console.log("🚀 ~ getOrders ~ userRole:", userRole)

    let query = {};
    if (userRole === "user") {
      query = { userId: id };
    } // Else, no filter - get all orders
    const orders = await Order.find(query).sort({ date: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch orders" });
  }
};

export { addOrder, getOrders, placeOrder };
