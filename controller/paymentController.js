const { initializedPayment, verifyTransaction } = require("../middleware/paystack")
const userModel = require("../model/authModel")
const cartModel = require("../model/cartModel")
const checkOut = require("../model/checkModel")


const payment = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login")
    }
    const userId = req.user.id
    const currentUser = await userModel.findOne({ _id: userId })
    const userCart = await cartModel.find({ userId: userId }).populate("productId")
    let totalAmount = 0;
    await userCart.forEach((item) => {
      totalAmount =
        totalAmount + item.productId.price * item.productId.quantity;
    });
    const { firstname, lastname, address, country, postcode, phone, city } = req.body

    const transactionData = {
      email: currentUser.email,
      userId: currentUser._id,
      currency: "NGN",
      firstname,
      lastname,
      address,
      city,
      country,
      postcode,
      phone,
      amount: totalAmount * 100,
      callback_url: "https://nove-project.onrender.com/callback",
    }

    const paymentResponse = await initializedPayment(transactionData)
    const { authorization_url } = paymentResponse.data
    res.redirect(authorization_url)
  } catch (err) {
    console.error(err)
    res.render("check-out", err.message)
  }
}


const callback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login")
    }
    const userId = req.user.id
    const currentUser = await userModel.findOne({ _id: userId })
    const userCart = await cartModel.find({ userId: userId }).populate("productId")
    let totalAmount = 0;
    await userCart.forEach((item) => {
      totalAmount =
        totalAmount + item.productId.price * item.productId.quantity;
    });
    const { reference, trxref } = req.query
    const paymentStatus = await verifyTransaction(trxref)

    if (paymentStatus.data.status === "success") {
      const products = userCart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));
      

      await checkOut.create({
        userId: userId,
        product: products,
        reference: reference || "",
        trxref: trxref || "",
        status: true
      })

      await cartModel.deleteMany({ userId: userId })
      res.render("check-out", { message: "Payment Successful", currentUser })
    } else {
      await checkOut.create({
        userId: userId,
        product: products,
        reference: reference || "",
        trxref: trxref || "",
        status: false,
      })
      res.render("check-out", { message: "Payment Failed", currentUser, userCart, totalAmount })
    }


  } catch (error) {
    console.error(error)
    res.render("check-out", {
      message: "An error occurred while processing the payment",
      currentUser: req.user ? await userModel.findOne({ _id: req.user.id }) : null,
      userCart: [],
      totalAmount: 0,
      error: error.message,
    })

  }
}


module.exports = { payment, callback }