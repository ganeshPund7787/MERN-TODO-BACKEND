import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })

export const Task = new mongoose.model("Task", taskSchema);
