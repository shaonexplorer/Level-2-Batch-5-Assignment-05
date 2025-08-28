import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { userRouter } from "./app/modules/user/user.routes";
import { authRouter } from "./app/modules/auth/auth.routes";
import passport from "passport";
import "./app/config/passport/passport";
import { parcelRouter } from "./app/modules/parcel/parcel.routes";

const app = express();

app.use(
  cors({
    origin: [
      `http://localhost:5173`,
      "https://level-2-batch-5-assignment-06.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: "welcome to parcel delivery api",
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parcel", parcelRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Route Not Found",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 400).json({
    status: error.status,
    success: false,
    message: error.message || "Bad Request",
    error,
  });
});

export default app;
