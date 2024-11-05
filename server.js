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

const allowedOrigins = [
    'https://token-mo.vercel.app',
    'https://open-d.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/register", userRoute)  
app.use("/transaction", transactionRoute)
app.use("/transfer", transactionRoute)
app.use("/balance", balanceRoute)
app.use("/login", authRoute)
app.use("/movies", movieRoute)

app.get('/', (req, res)=>{
    res.send(" Homepage Requested").status(200);
})

app.listen(5000, ()=>{console.log("App running on port 5000")})

