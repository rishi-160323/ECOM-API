import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProduct(req, res) {
        const products = await this.productRepository.getAll();
        return res.status(200).send(products);
    }

    async addProduct(req, res) {
        // 'name', 'price', 'sizes' are body parameters here.
        let { name, desc, price, category, sizes } = req.body;
        console.log(sizes)
        const newProduct = new ProductModel(name, desc, price, req.file.filename, category, sizes = sizes.split(','))
        // const newProduct = {
        //     name,
        //     desc,
        //     price: parseFloat(price),
        //     imageUrl: req.file.filename,
        //     category: category,
        //     sizes: sizes.split(','),

        // };

        const createRecord = await this.productRepository.add(newProduct);
        return res.status(201).send(createRecord);
    }

    async rateProduct(req, res, next) {
        try {
            const userID = req.userID;
            const productID = req.body.productID;
            const rating = req.body.rating;
            await this.productRepository.rate(userID, productID, rating)
            return res.status(200).send("Rating has been added.");
        } catch (err) {
            // return res.status(400).send(err.message);
            // In this way we can directly send this error on application level.
            next(err);
        }

    }

    async getOneProduct(req, res) {
        // 'id' is coming as root paramtere.
        const id = req.params.id;
        const product = await this.productRepository.get(id);
        console.log(product)
        if (!product) {
            res.status(404).send('Product is not found');
        } else {
            return res.status(200).send(product);
        }
    }

    async filterProducts(req, res, next) {
        try {
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;

            const result = await this.productRepository.filter(minPrice, maxPrice, category);
            console.log(result);
            return res.status(200).send(result);
        } catch (err) {
            console.log(err);
            return res.status(400).send("Something went wrong.")
            // next(err);
        }
    }

    async averagePrice(req, res, next) {
        try {
            const result = await this.productRepository.averageProductPriceCategory();
            return res.status(200).send(result);
        } catch (err) {
            console.log(err);
            return res.status(400).send("Something went wrong.")
        }
    }
}