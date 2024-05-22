import mongoose from "mongoose"

export const mongoConnection = async () => {
    mongoose
        .connect(process.env.MONGO_URI, { dbName: "Tasks" })
        .then(() => console.log(`MongoDb connected`))
        .catch((err) => console.log(`err while database connection : ${err}`))
}