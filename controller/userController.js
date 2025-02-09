const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const cloudinary = require("../config/cloudinaryConfig");
const Auth = require("../model/authModel");

const homePage = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      res.render("index", { currentUser });
    } else {
      res.render("index");
    }
  } catch (error) {
    res.render("index");
    console.log(error.message);
  }
};
const checkOut = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      const userCart = await Cart.find({ userId: userId }).populate(
        "productId"
      );

      let totalAmount = 0;
      await userCart.forEach((item) => {
        totalAmount =
          totalAmount + item.productId.price * item.productId.quantity;
      });
      console.log(totalAmount)
      res.render("check-out", { currentUser, userCart, totalAmount });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const contact = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      res.render("contact", { currentUser });
    } else {
      res.render("contact");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const productDetail = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      const productId = req.params.id;
      const product = await Product.findOne({ _id: productId });
      res.render("product-detail", { product, currentUser });
    } else {
      const productId = req.params.id;
      const product = await Product.findOne({ _id: productId });
      res.render("product-detail", { product });
    }
  } catch (error) {
    console.log(error.message);
    res.render("product-detail", { error });
  }
};

const productPage = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      const allProduct = await Product.find();
      const product = allProduct.map((item) => {
        return {
          ...item.toObject(),
          newImage:
            item.images[0] ||
            "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/97e18656-64e5-4c22-a981-665ad40856d6/W+NIKE+AL8.png",
        };
      });
      res.render("product-page", { product, currentUser });
    } else {
      const allProduct = await Product.find();
      const product = allProduct.map((item) => {
        return {
          ...item.toObject(),
          newImage:
            item.images[0] ||
            "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/97e18656-64e5-4c22-a981-665ad40856d6/W+NIKE+AL8.png",
        };
      });
      res.render("product-page", { product });
    }
  } catch (error) {
    console.log(error.message);
    res.render("product-page", { error });
  }
};

const getPostProduct = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      res.render("post-Product", { currentUser });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const postProduct = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });

      const { productName, price, category, description, tags } = req.body;
      const images = [];
      const emptyArr = [];
      const incomingFields = [
        "productName",
        "price",
        "category",
        "description",
        "tags",
      ];
      for (const child of incomingFields) {
        if (!req.body[child] || req.body[child] === "") {
          emptyArr.push(child);
        }
      }
      if (emptyArr.length > 0) {
        return res.render("post-Product", {
          error: `This field(s) ${emptyArr.join(",")} cannot be empty`,
        });
      }
      const tagArr = tags.split(",") || tags.split(" ");

      // File part
      if (req.files && Array.isArray(req.files)) {
        const fileArray = req.files.slice(0, 5);
        for (const file of fileArray) {
          const uploadedImage = await cloudinary.uploader.upload(file.path);
          images.push(uploadedImage.secure_url);
        }
      }

      await Product.create({
        productName: productName,
        price: price,
        category: category,
        description: description,
        tags: tagArr,
        images: images,
      });

      res.render("post-Product", { success: "Post Successful", currentUser });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
    res.render("post-Product", { error });
  }
};
const getCart = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      let totalAmount = 0;
      const allCart = await Cart.find().populate("productId");

      const cart = await allCart.map((item) => {
        totalAmount += item.productId.price;
        return {
          ...item.toObject(),
          newImage: item.productId.images[0],
          total: item.productId.price * item.productId.quantity,
        };
      });

      res.render("shopping-cart", { cart, currentUser, totalAmount });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const addCart = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const currentUser = await Auth.findOne({ _id: userId });
      const cartId = req.params.id;
      const product = await Product.findOne({ _id: cartId });
      await Cart.create({
        userId: userId,
        productId: cartId,
      });

      res.render("product-detail", {
        currentUser,
        product,
        success: "Added to cart successfully",
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  homePage,
  checkOut,
  contact,
  productPage,
  getCart,
  productDetail,
  getPostProduct,
  postProduct,
  addCart,
};
