import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.on("error", (err) => {
  console.log("Server Error : ", err);
  process.exit(1);
});

//middlewares setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("Server working");
});

//routes
import userRoute from "./routes/user.routes";
app.use("/user", userRoute);

export { app };
