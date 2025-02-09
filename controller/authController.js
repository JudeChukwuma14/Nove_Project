const Auth = require("../model/authModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = (req, res) => {
  res.render("signUp");
};
const login = (req, res) => {
  res.render("login");
};

const signUp = async (req, res) => {
  try {
    const { userName, email, password, retypePassword } = req.body;
    const emptyArr = [];
    const incomingFields = ["userName", "email", "password", "retypePassword"];
    for (const child of incomingFields) {
      if (!req.body[child] || req.body[child] === "") {
        emptyArr.push(child);
      }
    }
    if (emptyArr.length > 0) {
      return res.render("signUp", {
        error: `This field(s) ${emptyArr.join(",")} cannot be empty`,
      });
    }
    if (password !== retypePassword) {
      return res.render("signUp", { error: "Password dose not match" });
    }
    const checkEmail = await Auth.findOne({ email: email });
    if (checkEmail) {
      return res.render("signUp", { error: "Email already exist!!" });
    }
    const hashPassword = bcryptjs.hashSync(password, 10);
    await Auth.create({
      userName: userName,
      email: email,
      password: hashPassword,
    });

    return res.render("login", { success: "Account Created Successfully" });
  } catch (error) {
    return res.render("signUp");
    console.log(error.message);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emptyArr = [];
    const incomingFields = ["email", "password"];
    for (const child of incomingFields) {
      if (!req.body[child] || req.body[child] === "") {
        emptyArr.push(child);
      }
    }
    if (emptyArr.length > 0) {
      return res.render("signUp", {
        error: `This field(s) ${emptyArr.join(",")} cannot be empty`,
      });
    }
    const checkUser = await Auth.findOne({ email: email });
    if (!checkUser) {
      return res.render("login", { error: "Email and Password Mismatch" });
    }
    const checkPassword = bcryptjs.compareSync(password, checkUser.password);
    if (!checkPassword) {
      return res.render("login", { error: "Wrong Credentials" });
    }
    const token = await jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET);
    res.cookie("classProject", token, { expiresIn: "1h", httpOnly: true });
    res.redirect("/");
  } catch (error) {
    return res.render("login");
    console.log(error.message);
  }
};

const logout = async(req,res)=>{
  try {
    if(req.user){
      res.clearCookie("classProject")
      res.redirect("/login")
    }else{
      res.redirect("/login")
    }
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = { register, signUp, login, signIn, logout };
