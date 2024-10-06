import { getDB } from "../../config/mongodb.js";
import { ObjectId, ReturnDocument } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class cartItemsRepository {
    constructor() {
        this.collection = 'cartItems';
    }
    ;
    async add(productID, userID, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
            // find the document then update or insert.
            // '$inc' it will first find as per above filter if it would be there then it will update adding the value of quantity else create new.
            // update(filter, update, option)
            await collection.updateOne({ productID: new ObjectId(`${productID}`), userID: new ObjectId(`${userID}`) },
                {
                    // '$setOnInsert' will be only performed for the insertion not for the updation.
                    $setOnInsert: { _id: id },
                    $inc: { quantity: quantity }
                },
                { upsert: true });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong from cartIemsRepository", 500);
        }
    }

    async get(userID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection)
            return await collection.find({ userID: new ObjectId(`${userID}`) }).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong from cartIemsRepository", 500);
        }
    }

    async delete(cartItemID, userID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection)
            const result = await collection.deleteOne({ _id: new ObjectId(`${cartItemID}`), userID: new ObjectId(`${userID}`) });
            return result.deletedCount > 0;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong from cartIemsRepository", 500);
        }

    }

    async getNextCounter(db) {
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            { _id: "cartItemID" },
            { $inc: { value: 1 } },
            // 'returnDocument' will return document only after updation.
            { returnDocument: 'after' }
        )
        console.log(resultDocument);
        // first 'value' represents the document and the second one the attribute 'value' in the document.
        // return resultDocument.value.value; (not working).
        console.log(resultDocument.value);
        return resultDocument.value;
    }

}