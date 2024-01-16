import dotenv from "dotenv";
import { connectDB } from "./db";
import { app } from "./app";
dotenv.config();
connectDB()
  .then(() => {
    const port = process.env.PORT || 7000;
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo connection failed", err);
  });
