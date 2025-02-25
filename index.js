const express = require("express");
const urlRoute = require("./routes/url")
const URL = require("./models/url")
const path = require("path")
const bodyParser = require('body-parser');
const {connectToMongoDB} = require("./connect")

const app = express();
PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/shortUrl")
.then(()=>{ console.log("MongoDB connected");
})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

// app.use(express.json());
app.use(bodyParser.json());

app.get("/test", async (req, res)=>{
    const allUrls = await URL.find({});
    return res.render("home")
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
{
    $push:{
        visitHistory: {
            timestamp:Date.now(),
        },
    },
})
res.redirect(entry.redirectURL)
});

app.listen(PORT, ()=>{
console.log(`Server listened at PORT: ${PORT}`);
})