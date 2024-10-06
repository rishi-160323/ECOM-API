import CartItemModel from "./cartItems.model.js";
import cartItemsRepository from "./cartItems.repository.js";

import pkg from 'winston';
const { error } = pkg;

export default class CartItemController {
    constructor() {
        this.CartItemRepository = new cartItemsRepository();
    }
    async add(req, res) {
        try {
            const { productID, quantity } = req.body;
            console.log("controller product id", productID);
            console.log("controller quantity", quantity);
            const userID = req.userID;
            await this.CartItemRepository.add(productID, userID, quantity);
            return res.status(201).send("Cart is updated.");
        } catch (error) {
            console.log(error);
            return res.status(500).send("Something went wrong")
        }
    }

    async get(req, res) {
        try {
            const userID = req.userID;
            const items = await this.CartItemRepository.get(userID);
            return res.status(200).send(items);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Something went wrong")
        }
    }

    async delete(req, res) {
        const userID = req.userID;
        const cartItemID = req.params.id;

        const isdeleted = await this.CartItemRepository.delete(cartItemID, userID);
        console.log(isdeleted);
        if (!isdeleted) {
            return res.status(404).send(error);
        }
        return res.status(200).send("Cart item is removed.");
    }
}