import { getDB } from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/applicationError.js"


class UserRepository {

    constructor() {
        this.collection = "users"
    }

    async signUp(newUser) {
        try {
            // 1. Get the db.
            const db = getDB();
            // 2. Get the collections.
            const collection = db.collection(this.collection);
            // 3. Insert the document.
            await collection.insertOne(newUser);
            return newUser;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with the database!", 500)
        }
    }

    async signIn(email) {
        try {
            // 1. Get the db.
            const db = getDB();
            // 2. Get the collections.
            const collection = db.collection(this.collection);
            // 3. Find the document.
            return await collection.findOne({ email });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with the database!", 500)
        }
    }
}

export default UserRepository;