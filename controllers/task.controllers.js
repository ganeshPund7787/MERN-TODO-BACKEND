import { Task } from "../models/task.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const newTask = async (req, res, next) => {
    try {
        const { title } = req.body;
        await Task.create({
            title,
            user: req.user
        })

        res.status(201).json({
            success: true,
            message: "Task created successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const getAllTask = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ user: userId });
        res.status(200).json(tasks);
    } catch (error) {
        next(error)
    }
}


export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        task.isCompleted = !task.isCompleted;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task Updated"
        });
    } catch (error) {
        next(error);
    }
}


export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return next(errorHandler(400, "Task is not found"));

        await Task.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Task deleted"
        });
    } catch (error) {
        next(error);
    }
}

export const EditTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndUpdate(id, {
            $set: {
                title: req.body.title
            }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Task Update Successfuly"
        })
    } catch (error) {
        next(`Error while Edit todo ${error}`);
    }
}