import express from "express"
import {
    GoogleAuth,
    deleteUser,
    getAllUser,
    homePage,
    logout,
    profile,
    signIn,
    signUp,
    updateUser
} from "../controllers/user.controllers.js";
import { isAutheticated } from "../middleware/Autheticated.js";

const route = express.Router();

route.get("/", isAutheticated, homePage);
route.get("/profile", isAutheticated, profile);
route.get("/all", isAutheticated, getAllUser);

route.post("/signup", signUp);
route.post("/signin", signIn);
route.post("/googleAuth", GoogleAuth)

route.
    route("/:id")
    .put(isAutheticated, updateUser)
    .delete(isAutheticated, deleteUser)

route.get("/logout", logout);

export default route;