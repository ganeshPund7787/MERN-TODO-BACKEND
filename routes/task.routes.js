import express from "express"
import { EditTask, deleteTask, getAllTask, newTask, updateTask } from "../controllers/task.controllers.js";
import { isAutheticated } from "../middleware/Autheticated.js";

const route = express.Router();

route.post("/new", isAutheticated, newTask);

route.get("/all", isAutheticated, getAllTask);

route.route("/:id")
    .put(isAutheticated, updateTask)
    .delete(isAutheticated, deleteTask);

route.put("/edit/:id", isAutheticated, EditTask);
export default route;
