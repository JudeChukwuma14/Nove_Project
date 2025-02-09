const express = require("express");
const {
  homePage,
  contact,
  checkOut,
  productPage,
  getPostProduct,
  postProduct,
  productDetail,
  addCart,
  getCart,


} = require("../controller/userController");
const upload = require("../config/multerConfig");
const { register, signUp, login, signIn, logout } = require("../controller/authController");
const checkUser = require("../middleware/userToken");
const { payment, callback_url, callback } = require("../controller/paymentController");

const router = express.Router();

router.get("/",checkUser, homePage);
router.get("/contact",checkUser, contact);
router.get("/checkout",checkUser, checkOut);
router.get("/product",checkUser, productPage);
router.get("/productdetail/:id",checkUser, productDetail);
router.get("/shoppingcart",checkUser, getCart);
router.get("/addCart/:id",checkUser, addCart);
router.get("/getproduct",checkUser, getPostProduct);
router.post("/postItem",checkUser,upload,postProduct)
router.get("/signup", register)
router.get("/login", login)
router.get("/logout", logout)
router.post("/createuser", signUp)
router.post("/signin", signIn)
router.post("/payment", checkUser, payment)
router.get("/callback", checkUser, callback)
module.exports = router;
