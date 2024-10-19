import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"


dotenv.config({
  path: './.env'
})


const app = express()
const origin = process.env.ALLOWED_ORIGINS

const allowedOrigins = origin.split(',');
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

//importing routes
import userRouter from "./routes/user.route.js";

app.get("/",(req, res) => {
    res.send('hello world')
  })

//route decleare
app.use("/api/v1/user",userRouter)

export {app}