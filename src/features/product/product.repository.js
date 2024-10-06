import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";

class ProductRepository {
    constructor() {
        this.collection = "products"
    }

    async add(newProduct) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database operation in product repository!", 500)
        }

    }

    async get(id) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const product = await collection.findOne({ _id: new mongoose.Types.ObjectId(`${id}`) })
            return product;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database operation in product repository!", 500)
        }
    }

    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            return products;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database operation in product repository!", 500)
        }

    }

    async filter(minPrice, maxPrice, category) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // you can learn about $and, $or and $in operator.
            // remember that $in expects array as an input.
            // ex. ['Cat1', 'Cat2'] this kind of input should be from url but it will be treated as string so for that if you are getting that are in 'category' assumed as 'categories' parameter
            // then categories = JSON.parse(categories.replace(/'/g, '"')) we are converting ' in ".
            let filterExpression = {};
            if (minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice) }
            }
            if (maxPrice) {
                filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice) }
            }

            // after above line it will look like.
            // {
            //      price: { $gte: 100, $lte: 200 } // if minPrice is 100 and maxPrice is 200
            // }

            if (category) {
                filterExpression.category = category;
            }
            // project({}) is used to hide and show the attributes of document with the value.
            // learn more about the '$slice' operator. it also supports negative slicing as well.
            return await collection.find(filterExpression).project({ name: 1, price: 1, _id: 0, ratings: { slice: 2 } }).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database operation in product repository!", 500)
        }
    }

    // async rate(userID, productID, rating) {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         console.log(userID, productID, rating)
    //         await collection.updateOne({
    //             _id: new mongoose.Types.ObjectId(`${userID}`)
    //         }, {
    //             $push: { ratings: { userID: new mongoose.Types.ObjectId(`${productID}`), rating } }
    //         })
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with the database operation in product repository!", 500)
    //     }

    // }


    // async rate(userID, productID, rating) {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // 1. find the product.
    //         const product = await collection.findOne({ _id: new ObjectId(`${productID}`) })
    //         // 2. Find the rating.
    //         const userRating = await product?.ratings?.find(r => r.userID == userID);
    //         if (userRating) {
    //             // 3.update the rating.
    //             await collection.updateOne({ _id: new ObjectId(`${productID}`), "ratings.userID": new ObjectId(`${userID}`) },
    //                 {
    //                     $set: {
    //                         // $ represents the object fetched by the above given query.
    //                         "ratings.$.rating": rating
    //                     }
    //                 })
    //         } else {

    //             await collection.updateOne(
    //                 {
    //                     _id: new ObjectId(`${productID}`),
    //                 },
    //                 {
    //                     $push: { ratings: { userID: new ObjectId(`${userID}`), rating } },
    //                 }
    //             );
    //         }

    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }


    // this is another option of above code it is useful for updating existing records first it removes then adds.
    async rate(userID, productID, rating) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // 1. Removes existing entry.
            await collection.updateOne({
                _id: new ObjectId(`${productID}`)
            }, {
                $pull: { ratings: { userID: new ObjectId(`${userID}`) } }
            })

            // 2. Add new entry.
            await collection.updateOne({
                _id: new ObjectId(`${productID}`)
            }, {
                $push: { ratings: { userID: new ObjectId(`${userID}`), rating } }
            })
            // above mentioned both opeartions are atomic means either they will execute together or no one will be executed.
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
    async averageProductPriceCategory() {
        try {
            const db = getDB();
            return await db.collection(this.collection).aggregate([
                {
                    // 1. Stage One: Get average price per category.
                    // first it will group the documents based on the keys of 'category' then calculate the avg of price with the key 'averagePrice' for all groups.
                    $group: {
                        _id: "$category",
                        averagePrice: { $avg: "$price" }
                    }
                }
            ]).toArray();
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // find the average rating of product.

}

export default ProductRepository;



//   // Update a tag in an expense
//   async updateTagInExpense(id, oldTag, newTag) {
//     const db = getDB();
//     const filter = { _id: new ObjectId(id), tags: oldTag };
//     const update = { $set: { "tags.$": newTag } };
//     const expenses = await db.collection(this.collectionName).updateOne(filter, update);
//     return expenses;
//   }

//   // Delete a tag from an expense
//   async deleteTagFromExpense(id, tag) {

//     const db = getDB();
//     const filter = { _id: new ObjectId(id) };
//     const update = { $pull: { tags: tag } };
//     await db.collection(this.collectionName).updateOne(filter, update);