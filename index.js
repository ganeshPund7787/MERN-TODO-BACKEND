import express from "express";
import { config } from "dotenv"
import { mongoConnection } from "./data/userData.js";
import route from "./routes/user.routes.js";
import TaskRoute from "./routes/task.routes.js"
import cookieParser from "cookie-parser";
import cors from 'cors'
import { errorMiddleware } from "./middleware/error.middleware.js";
config({ path: "./config/.env" })
mongoConnection();

const app = express();
app.use(cors({ origin: "*", credentials: true }))
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", route);
app.use("/api/task", TaskRoute);


app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`)
});