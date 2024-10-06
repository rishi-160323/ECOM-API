import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

// Creating model from schema.
// A model is a entire collection,
// A instance of model is one document from collection.

const UserModel = mongoose.model('User', userSchema);

export default class UserRepository {
    async signUp(user) {
        try {
            // Create instance of model.
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database!", 500);
        }
    }

    async signIn(email, password) {
        try {
            return await UserModel.findOne({ email, password });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database!", 500);
        }
    }

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database!", 500);
        }
    }

    async resetPassword(userID, hashedNewPassword) {
        try {
            let user = await UserModel.findById(userID);
            user.password = hashedNewPassword;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database!", 500);
        }
    }


}