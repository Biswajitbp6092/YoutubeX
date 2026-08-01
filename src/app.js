import express from "express";
import cookieParser from "cookie-parser";   
import cors from "cors";

const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))
app.use(express.json({limit:"50kb"}));
app.use(express.urlencoded({extended:true,limit:"50kb"})); 
app.use(express.static("public"));
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

export default app;