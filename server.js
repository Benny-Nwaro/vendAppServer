const express = require("express")
const bodyParser = require('body-parser')
const connectDb = require("./config/db")
const userRoute = require("./routes/userRoute")
const transactionRoute = require("./routes/transactionRoute")
const authRoute = require("./routes/authRoute")
const balanceRoute = require("./routes/balanceRoute")
const movieRoute = require("./routes/movieRoute.js")
const cors = require("cors")

const app = express()

connectDb()

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/register", userRoute)  
app.use("/transaction", transactionRoute)
app.use("/transfer", transactionRoute)
app.use("/balance", balanceRoute)
app.use("/login", authRoute)
app.use("/movies", movieRoute)

app.get('/', (req, res)=>{
    res.send("Requesting Homepage").status(200);
})


app.listen(5000, ()=>{console.log("App running on port 5000")})