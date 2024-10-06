import { getClient, getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";
import { Error } from "mongoose";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }


    async placeOrder(userId) {
        const client = getClient();
        // Learn more about 'startSession; in transactions in MongoDB.
        const session = client.startSession();
        try {
            const db = getDB();
            session.startTransaction()
            // 1. Get cartitems and create total amount.
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
            console.log(finalTotalAmount);

            // 2. Create and order record.
            const newOrder = new OrderModel(new ObjectId(`${userId}`), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, { session });

            // 3. Reduce the stock.
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } }, { session }
                )
            }
            // throw new Error("Something went wrong in placeOrder.")
            // 4. Clear the cart items.
            await db.collection("cartItems").deleteMany({
                userID: new ObjectId(`${userId}`)
            }, { session })
            session.commitTransaction();
            session.endSession();
            return;
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }

    }


    async getTotalAmount(userId, session) {

        const db = getDB()
        const items = await db.collection("cartItems").aggregate([
            // 1. get cartItems for the user.
            {
                // It will provide the cartItems only related to the user.
                // learn more about '$match' operator.
                $match: { userID: new ObjectId(`${userId}`) }
            },
            // 2. Get the products from products collection.
            {
                // learn more about '$lookup' operator.
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            // 3. Unwind the 'productInfo' nested array.
            {
                $unwind: "$productInfo"
            },
            // 4. Calculate total amount for each cartItems.
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            },
        ], { session }).toArray();
        // console.log($productInfo.price, $quantity)
        return items;
    }
}


// MongoDB cmd to create replica set.
// mongod --replSet rs0 --dbpath=mongodb-data
// rs.initiate()  --> to initiate the replicaset where 'rs' is the name of replica.