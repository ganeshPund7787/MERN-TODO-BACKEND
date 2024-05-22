import { errorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const isAutheticated = async (req, res, next) => {
    try {
        const { cookie } = req.cookies;
        if (!cookie) return next(errorHandler(404, "You should login first"));

        jwt.verify(cookie, process.env.JWT_SECREATE_KEY, async (err, user) => {
            if (err) return next(errorHandler(401, "Token is not valid"))

            req.user = await User.findById({ _id: user._id })
            next();
        });

    } catch (error) {
        next(error);
    }
}