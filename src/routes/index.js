import { Router } from "express";
import userRouter from "./userRoutes.js"
import marketRouter from "./marketRoutes.js"
import gameRouter from "./gameRoutes.js"
import resultRouter from "./ResultRoutes.js"
import loginRouter from "./login.js"
import settingRouter from "./setting.js"

const v1Router = Router();

v1Router.use("/user",userRouter); //// use localhost:port/api/v1/user + userRoute
v1Router.use("/market",marketRouter);
v1Router.use("/game", gameRouter)
v1Router.use("/result", resultRouter)
v1Router.use("/login",loginRouter)
v1Router.use("/setting",settingRouter)

export default v1Router;
