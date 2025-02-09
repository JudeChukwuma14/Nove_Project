const express = require("express");
const app = express();
const expressHbs = require("express-handlebars");
require("dotenv").config()
const allRouters = require("./router/userRoute");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const MONGODB = process.env.MONGO_URL

mongoose.connect(MONGODB)
.then(()=>{
    console.log("Data base is connected");
})
.catch((err) => {
    console.log(err.message);
})

app.engine("hbs", expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set("view engine", "hbs")
app.use(express.static("public"));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", allRouters)

app.get("*", (req,res) => {
    res.send("<h1>Page not found</h1>");
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
})



