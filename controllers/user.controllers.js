import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.handler.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const homePage = (req, res, next) => {
    res.json({
        message: "Home Page"
    })
}


export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isUserExist = await User.findOne({ email });

        if (isUserExist) return next(errorHandler(400, "email alredy taken"))

        const hashPassword = bcryptjs.hashSync(password, 10);
        await User.create({
            username, email, password: hashPassword
        })
        res.status(201).json({
            message: "User register successfuly"
        })

    } catch (error) {
        next(error)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email })

        if (!validUser) return next(errorHandler(404, "email is not exist"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) return next(errorHandler(404, "Incorrect email or password"));

        const cookie = jwt.sign({ _id: validUser._id }, process.env.JWT_SECREATE_KEY);

        const { password: hashPassword, ...user } = validUser._doc;

        res.cookie("cookie", cookie, {
            httpOnly: true,
            maxAge: 28 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None"
        }).status(202).json(user);
    } catch (error) {
        next(error);
    }
}

export const profile = async (req, res, next) => {
    try {
        const { user } = req;

        const { password, ...userData } = user._doc;

        res.status(200).json(userData)
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(400, "You can update only your account"));
    }
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
            user.password = req.body.password;
        }
        user.username = req.body.username;

        await user.save();

        const { password, ...userData } = user._doc;

        res.status(200).json({
            message: "User update successfully",
            userData
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(400, "You can delete only your account"));
    }
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.status(200).clearCookie("cookie", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }).json({
            message: "User deleted successfuly"
        })

    } catch (error) {
        next(error)
    }
}

export const logout = (req, res, next) => {
    try {

        res.status(200).clearCookie("cookie", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }).json({
            message: "User Logout successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error)
    }
}


export const GoogleAuth = async (req, res, next) => {
    try {

        const { username, email } = req.body;

        const isEmailExist = await User.findOne({ email })

        if (isEmailExist) {
            const cookie = jwt.sign({ _id: isEmailExist._id }, process.env.JWT_SECREATE_KEY);
            const { password, ...userData } = isEmailExist._doc;
            res.cookie("cookie", cookie, {
                httpOnly: true,
                maxAge: 28 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "None"
            }).status(200).json(userData);
            console.log('already exist');
            return;
        }

        const GeneratePasssword = Math.floor(Math.random() * 100000000 + 100000000).toString();

        const hashPassword = bcryptjs.hashSync(GeneratePasssword, 10);

        const newUser = await User.create({
            username, email, password: hashPassword
        })

        const { password, ...data } = newUser._doc;
        const cookie = jwt.sign({ _id: newUser._id }, process.env.JWT_SECREATE_KEY);

        res.status(201).cookie("cookie", cookie, {
            httpOnly: true,
            maxAge: 28 * 24 * 60 * 60 * 1000
        }).json(data);

    } catch (error) {
        next(`Error While Continue with google ${error}`)
    }
}