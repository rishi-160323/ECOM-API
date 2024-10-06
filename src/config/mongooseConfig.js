import mongoose from "mongoose";

const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected using mongoose.");
    } catch (err) {
        console.log("Error in connecting db");
        console.log(err);
    }

}